import { NextResponse } from 'next/server';

interface WorkflowRequest {
  token: string;
  email: string;
  resumeLink: string;
  sheetLink: string;
}

export async function POST(request: Request) {
  try {
    const { token, email, resumeLink, sheetLink }: WorkflowRequest = await request.json();

    // Verify the token with Google
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
    );

    if (!response.ok) {
      throw new Error('Invalid token');
    }

    const data = await response.json();

    // Verify that the token has the required scopes
    const requiredScopes = [
      'https://www.googleapis.com/auth/gmail.send',
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/gmail.compose',
      'https://www.googleapis.com/auth/gmail.metadata',
      'https://www.googleapis.com/auth/gmail.insert',
      'https://www.googleapis.com/auth/gmail.settings.basic',
      'https://www.googleapis.com/auth/gmail.settings.sharing',
      'https://www.googleapis.com/auth/gmail.addons.current.action.compose',
      'https://www.googleapis.com/auth/gmail.addons.current.message.action',
      'https://www.googleapis.com/auth/gmail.labels',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'openid',
      'https://www.googleapis.com/auth/gmail.addons.current.message.metadata',
      'https://www.googleapis.com/auth/gmail.addons.current.message.readonly'
    ];

    const hasRequiredScopes = requiredScopes.every(scope =>
      data.scope.includes(scope)
    );

    if (!hasRequiredScopes) {
      throw new Error('Missing required scopes');
    }

    // Log received data
    console.log('Received workflow data:', {
      email,
      resumeLink,
      sheetLink,
      tokenValid: true
    });

    // Here you can add your workflow logic using the received data
    // For example:
    // - Process the sheet
    // - Send emails
    // - Update tracking information

    return NextResponse.json({ 
      success: true,
      message: 'Workflow started successfully',
      data: {
        email,
        resumeLink,
        sheetLink,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error processing workflow:', error);
    return NextResponse.json(
      { 
        error: 'Failed to process workflow',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 400 }
    );
  }
} 