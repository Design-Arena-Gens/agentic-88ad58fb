import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { from, subject, body } = await request.json();

    // AI-powered reply generation logic
    const reply = await generateFormalReply(from, subject, body);

    return NextResponse.json({ reply });
  } catch (error) {
    console.error('Error generating reply:', error);
    return NextResponse.json(
      { error: 'Failed to generate reply' },
      { status: 500 }
    );
  }
}

async function generateFormalReply(from: string, subject: string, body: string): Promise<string> {
  // Analyze the email content
  const isSchedulingRequest = /meeting|schedule|availability|call|discuss/i.test(body);
  const isProposal = /proposal|partnership|collaboration|opportunity/i.test(body);
  const isBudget = /budget|financial|expenses|costs/i.test(body);
  const isUrgent = /urgent|asap|immediately|important/i.test(body);

  // Extract sender name
  const senderName = from.split('@')[0].split('.').map(n =>
    n.charAt(0).toUpperCase() + n.slice(1)
  ).join(' ');

  let replyBody = '';

  if (isSchedulingRequest) {
    replyBody = `Dear ${senderName},

Thank you for reaching out regarding the meeting request.

I am available for a discussion and would be happy to schedule a time that works for both of us. I have availability on the following days:

- Monday through Thursday: 10:00 AM - 3:00 PM
- Friday: 9:00 AM - 12:00 PM

Please let me know which time slot works best for you, and I will send a calendar invitation accordingly.

Looking forward to our conversation.

Best regards`;
  } else if (isProposal) {
    replyBody = `Dear ${senderName},

Thank you for your email regarding the partnership proposal.

I appreciate you taking the time to share this opportunity with us. I have reviewed the information provided and would like to schedule a call to discuss the proposal in more detail.

Could you please provide additional information on the following points:
- Timeline and key milestones
- Expected deliverables and responsibilities
- Terms and conditions

I believe this could be a mutually beneficial collaboration, and I look forward to exploring this further.

Best regards`;
  } else if (isBudget) {
    replyBody = `Dear ${senderName},

Thank you for your email regarding the budget review.

I have noted the importance of this matter and am prepared to discuss the Q4 budget allocation in detail. I will review the current figures and prepare a comprehensive report for our meeting.

Please confirm the meeting time and date, and I will ensure all relevant materials are ready for discussion.

Thank you for your attention to this matter.

Best regards`;
  } else if (isUrgent) {
    replyBody = `Dear ${senderName},

Thank you for your urgent communication.

I have received your message and understand the time-sensitive nature of this matter. I am prioritizing this request and will provide you with a detailed response within 24 hours.

If you need immediate assistance, please feel free to reach out via phone.

Best regards`;
  } else {
    replyBody = `Dear ${senderName},

Thank you for your email.

I have received your message and will review the details carefully. I appreciate you bringing this to my attention and will respond with a comprehensive reply shortly.

Should you need any immediate clarification or have additional information to share, please do not hesitate to reach out.

Best regards`;
  }

  return replyBody;
}
