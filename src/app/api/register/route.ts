import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin } from '@/lib/supabase';
import { sendEmail, generatePendingEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const roll_college = formData.get('roll_college') as string;
    const utr = formData.get('utr') as string;
    const screenshot = formData.get('screenshot') as File | null;

    // Validation
    if (!name || !email || !phone || !roll_college || !utr) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Phone validation
    if (!/^\d{10}$/.test(phone)) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    // Check for duplicate UTR
    const { data: existingUTR } = await supabaseAdmin
      .from('registrations')
      .select('id')
      .eq('utr', utr)
      .single();

    if (existingUTR) {
      return NextResponse.json(
        { error: 'This UTR has already been used for another registration' },
        { status: 400 }
      );
    }

    // Check for duplicate email
    const { data: existingEmail } = await supabaseAdmin
      .from('registrations')
      .select('id')
      .eq('email', email)
      .single();

    if (existingEmail) {
      return NextResponse.json(
        { error: 'This email has already been registered' },
        { status: 400 }
      );
    }

    const registrationId = uuidv4();
    let screenshotUrl: string | null = null;

    // Upload screenshot if provided
    if (screenshot && screenshot.size > 0) {
      const fileExt = screenshot.name.split('.').pop();
      const fileName = `${registrationId}.${fileExt}`;
      
      const { error: uploadError } = await supabaseAdmin.storage
        .from('screenshots')
        .upload(fileName, screenshot, {
          contentType: screenshot.type,
        });

      if (!uploadError) {
        const { data: urlData } = supabaseAdmin.storage
          .from('screenshots')
          .getPublicUrl(fileName);
        screenshotUrl = urlData.publicUrl;
      }
    }

    // Create registration
    const { error: insertError } = await supabaseAdmin
      .from('registrations')
      .insert({
        id: registrationId,
        name,
        email,
        phone,
        roll_college,
        utr,
        screenshot_url: screenshotUrl,
        status: 'pending',
        checked_in: false,
      });

    if (insertError) {
      console.error('Insert error:', insertError);
      return NextResponse.json(
        { error: 'Failed to create registration' },
        { status: 500 }
      );
    }

    // Send confirmation email
    const registration = {
      id: registrationId,
      name,
      email,
      phone,
      roll_college,
      utr,
      screenshot_url: screenshotUrl,
      status: 'pending' as const,
      created_at: new Date().toISOString(),
      checked_in: false,
    };

    await sendEmail({
      to: email,
      subject: 'Registration Received - COALESCE 2026',
      html: generatePendingEmail(registration),
    });

    return NextResponse.json({
      success: true,
      registrationId,
      message: 'Registration submitted successfully',
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
