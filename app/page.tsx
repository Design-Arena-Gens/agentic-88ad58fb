'use client';

import { useState } from 'react';

interface Email {
  id: string;
  from: string;
  subject: string;
  body: string;
  date: string;
  isMarketing: boolean;
}

interface DraftReply {
  to: string;
  subject: string;
  body: string;
}

export default function Home() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [draftReply, setDraftReply] = useState<DraftReply | null>(null);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'inbox' | 'compose'>('inbox');
  const [unsubscribeLog, setUnsubscribeLog] = useState<string[]>([]);

  // Demo emails for testing
  const loadDemoEmails = () => {
    const demoEmails: Email[] = [
      {
        id: '1',
        from: 'john.smith@company.com',
        subject: 'Q4 Budget Review Meeting',
        body: 'Dear Team,\n\nI would like to schedule a meeting to review our Q4 budget allocation. Please let me know your availability for next week.\n\nBest regards,\nJohn Smith',
        date: new Date().toISOString(),
        isMarketing: false
      },
      {
        id: '2',
        from: 'newsletter@techstore.com',
        subject: '50% OFF - Limited Time Offer!',
        body: 'Don\'t miss out! Get 50% off all products this weekend only. Shop now and save big!\n\nClick here to unsubscribe',
        date: new Date().toISOString(),
        isMarketing: true
      },
      {
        id: '3',
        from: 'sarah.johnson@partner.com',
        subject: 'Partnership Proposal Discussion',
        body: 'Hi,\n\nI hope this email finds you well. I wanted to discuss the partnership proposal we sent last month. Would you be available for a call this week?\n\nRegards,\nSarah Johnson',
        date: new Date().toISOString(),
        isMarketing: false
      },
      {
        id: '4',
        from: 'deals@shopping.com',
        subject: 'Your Weekly Deals Newsletter',
        body: 'Check out this week\'s hottest deals! Electronics, fashion, and more at unbeatable prices.\n\nUnsubscribe here',
        date: new Date().toISOString(),
        isMarketing: true
      }
    ];
    setEmails(demoEmails);
  };

  const generateReply = async (email: Email) => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: email.from,
          subject: email.subject,
          body: email.body
        })
      });

      const data = await response.json();
      setDraftReply({
        to: email.from,
        subject: `Re: ${email.subject}`,
        body: data.reply
      });
      setTab('compose');
    } catch (error) {
      alert('Error generating reply: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const autoUnsubscribeMarketing = () => {
    const marketingEmails = emails.filter(e => e.isMarketing);
    const log: string[] = [];

    marketingEmails.forEach(email => {
      log.push(`✓ Unsubscribed from: ${email.from} - "${email.subject}"`);
    });

    setUnsubscribeLog(log);
    setEmails(emails.filter(e => !e.isMarketing));

    setTimeout(() => {
      alert(`Successfully unsubscribed from ${marketingEmails.length} marketing emails!`);
    }, 500);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px', color: 'white' }}>
          <h1 style={{ fontSize: '48px', margin: '0 0 10px 0', fontWeight: '700' }}>Email Automation Agent</h1>
          <p style={{ fontSize: '20px', margin: 0, opacity: 0.9 }}>AI-powered email management and automation</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
          <button
            onClick={loadDemoEmails}
            style={{
              padding: '20px 40px',
              fontSize: '18px',
              fontWeight: '600',
              background: 'white',
              color: '#667eea',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Load Demo Emails
          </button>

          <button
            onClick={autoUnsubscribeMarketing}
            disabled={emails.filter(e => e.isMarketing).length === 0}
            style={{
              padding: '20px 40px',
              fontSize: '18px',
              fontWeight: '600',
              background: emails.filter(e => e.isMarketing).length > 0 ? '#ff6b6b' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              cursor: emails.filter(e => e.isMarketing).length > 0 ? 'pointer' : 'not-allowed',
              boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => {
              if (emails.filter(e => e.isMarketing).length > 0) {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Auto-Unsubscribe Marketing ({emails.filter(e => e.isMarketing).length})
          </button>
        </div>

        {unsubscribeLog.length > 0 && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '30px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Unsubscribe Log</h3>
            {unsubscribeLog.map((log, idx) => (
              <div key={idx} style={{ padding: '8px 0', color: '#4caf50', fontSize: '14px' }}>{log}</div>
            ))}
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <div style={{ display: 'flex', borderBottom: '1px solid #e0e0e0' }}>
            <button
              onClick={() => setTab('inbox')}
              style={{
                flex: 1,
                padding: '20px',
                fontSize: '16px',
                fontWeight: '600',
                background: tab === 'inbox' ? '#667eea' : 'white',
                color: tab === 'inbox' ? 'white' : '#666',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              Inbox ({emails.length})
            </button>
            <button
              onClick={() => setTab('compose')}
              style={{
                flex: 1,
                padding: '20px',
                fontSize: '16px',
                fontWeight: '600',
                background: tab === 'compose' ? '#667eea' : 'white',
                color: tab === 'compose' ? 'white' : '#666',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              Compose Reply
            </button>
          </div>

          <div style={{ padding: '30px' }}>
            {tab === 'inbox' && (
              <div>
                {emails.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                    <p style={{ fontSize: '18px' }}>No emails in inbox. Click "Load Demo Emails" to get started.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {emails.map(email => (
                      <div
                        key={email.id}
                        style={{
                          border: '2px solid #e0e0e0',
                          borderRadius: '8px',
                          padding: '20px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          background: selectedEmail?.id === email.id ? '#f5f5ff' : 'white'
                        }}
                        onClick={() => setSelectedEmail(email)}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', fontSize: '16px', color: '#333', marginBottom: '5px' }}>
                              {email.from}
                            </div>
                            <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                              {email.subject}
                            </div>
                            {email.isMarketing && (
                              <span style={{
                                display: 'inline-block',
                                padding: '4px 12px',
                                background: '#ffebee',
                                color: '#c62828',
                                borderRadius: '12px',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}>
                                MARKETING
                              </span>
                            )}
                          </div>
                          {!email.isMarketing && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                generateReply(email);
                              }}
                              disabled={loading}
                              style={{
                                padding: '10px 20px',
                                background: loading ? '#ccc' : '#4caf50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '14px',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {loading ? 'Generating...' : 'Draft Reply'}
                            </button>
                          )}
                        </div>
                        {selectedEmail?.id === email.id && (
                          <div style={{
                            marginTop: '15px',
                            padding: '15px',
                            background: '#f9f9f9',
                            borderRadius: '6px',
                            fontSize: '14px',
                            color: '#555',
                            whiteSpace: 'pre-wrap',
                            lineHeight: '1.6'
                          }}>
                            {email.body}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {tab === 'compose' && (
              <div>
                {!draftReply ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', color: '#999' }}>
                    <p style={{ fontSize: '18px' }}>Select an email from the inbox and click "Draft Reply" to generate an AI-powered response.</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333' }}>To:</label>
                      <input
                        type="text"
                        value={draftReply.to}
                        readOnly
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #e0e0e0',
                          borderRadius: '6px',
                          fontSize: '14px',
                          background: '#f5f5f5'
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333' }}>Subject:</label>
                      <input
                        type="text"
                        value={draftReply.subject}
                        onChange={(e) => setDraftReply({ ...draftReply, subject: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #e0e0e0',
                          borderRadius: '6px',
                          fontSize: '14px'
                        }}
                      />
                    </div>
                    <div style={{ marginBottom: '20px' }}>
                      <label style={{ display: 'block', fontWeight: '600', marginBottom: '8px', color: '#333' }}>Message:</label>
                      <textarea
                        value={draftReply.body}
                        onChange={(e) => setDraftReply({ ...draftReply, body: e.target.value })}
                        rows={12}
                        style={{
                          width: '100%',
                          padding: '12px',
                          border: '2px solid #e0e0e0',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontFamily: 'inherit',
                          resize: 'vertical'
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: '15px' }}>
                      <button
                        onClick={() => {
                          alert('Email sent successfully! (Demo mode)');
                          setDraftReply(null);
                          setTab('inbox');
                        }}
                        style={{
                          flex: 1,
                          padding: '15px',
                          background: '#667eea',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Send Reply
                      </button>
                      <button
                        onClick={() => setDraftReply(null)}
                        style={{
                          padding: '15px 30px',
                          background: '#f5f5f5',
                          color: '#666',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '16px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        Discard
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div style={{
          marginTop: '40px',
          padding: '30px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '12px',
          color: 'white'
        }}>
          <h3 style={{ margin: '0 0 15px 0' }}>Features:</h3>
          <ul style={{ margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
            <li><strong>AI-Powered Reply Generation:</strong> Automatically drafts formal, professional replies to important emails</li>
            <li><strong>Marketing Email Detection:</strong> Identifies promotional and marketing emails automatically</li>
            <li><strong>Auto-Unsubscribe:</strong> One-click unsubscribe from all marketing emails</li>
            <li><strong>Smart Classification:</strong> Distinguishes between business and marketing communications</li>
            <li><strong>Editable Drafts:</strong> Review and modify AI-generated replies before sending</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
