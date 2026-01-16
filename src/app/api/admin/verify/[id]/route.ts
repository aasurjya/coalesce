import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { generateTicketPDF } from '@/lib/generate-ticket';
import { sendEmail, generateConfirmationEmail } from '@/lib/email';
import { Registration } from '@/lib/types';

async function verifyAdmin() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get('admin_session')?.value;

  if (!sessionToken) return false;

  const { data: session } = await supabaseAdmin
    .from('admin_sessions')
    .select('*')
    .eq('token', sessionToken)
    .gt('expires_at', new Date().toISOString())
    .single();

  return !!session;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const isAdmin = await verifyAdmin();
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Get registration
    const { data: registration, error: fetchError } = await supabaseAdmin
      .from('registrations')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError || !registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      );
    }

    if (registration.status !== 'pending') {
      return NextResponse.json(
        { error: 'Registration is not pending' },
        { status: 400 }
      );
    }

    // Generate PDF ticket
    const pdfBuffer = await generateTicketPDF(registration as Registration);

    // Upload PDF to storage
    const fileName = `tickets/${id}.pdf`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from('tickets')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      console.error('PDF upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to generate ticket' },
        { status: 500 }
      );
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('tickets')
      .getPublicUrl(fileName);

    const ticketUrl = urlData.publicUrl;

    // Update registration status
    const { error: updateError } = await supabaseAdmin
      .from('registrations')
      .update({
        status: 'verified',
        verified_at: new Date().toISOString(),
        ticket_url: ticketUrl,
      })
      .eq('id', id);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update registration' },
        { status: 500 }
      );
    }

    // Send confirmation email with ticket
    const updatedRegistration = {
      ...registration,
      status: 'verified' as const,
      verified_at: new Date().toISOString(),
      ticket_url: ticketUrl,
    };

    await sendEmail({
      to: registration.email,
      subject: '🎉 Registration Confirmed - COALESCE 2026',
      html: generateConfirmationEmail(updatedRegistration),
      attachments: [
        {
          filename: `COALESCE-Ticket-${id.substring(0, 8).toUpperCase()}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    return NextResponse.json({ success: true, ticketUrl });
  } catch (error) {
    console.error('Verify error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
