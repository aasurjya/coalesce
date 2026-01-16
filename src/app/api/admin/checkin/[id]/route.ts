import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';

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

    if (registration.status !== 'verified') {
      return NextResponse.json(
        { error: 'Registration is not verified' },
        { status: 400 }
      );
    }

    if (registration.checked_in) {
      return NextResponse.json(
        { error: 'Already checked in' },
        { status: 400 }
      );
    }

    // Update check-in status
    const { error: updateError } = await supabaseAdmin
      .from('registrations')
      .update({
        checked_in: true,
      })
      .eq('id', id);

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to check in' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Check-in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
