import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, ShieldAlert } from 'lucide-react';

const BOT_KNOWLEDGE = [
  {
    name: 'home_menu',
    keywords: ['hi', 'hello', 'నమస్కారం', 'హాయ్', 'home', 'menu', 'start', 'help', 'meebhoomi', 'మీ భూమి'],
    reply: '👋 MeeBhoomi Chat Assistant కి స్వాగతం / Welcome!\n\nనేను మీకు మీభూమి సేవల్లో సహాయం చేయగలను. / I can help you with MeeBhoomi services.\n\nServices: Adangal, ROR-1B, LP Maps, Pattadar, E-Passbook, Aadhaar Link Status, Mutation/LP, Survey Records.\n\n🔒 Please don’t share personal information such as Aadhaar number. / దయచేసి ఆధార్ వంటి వ్యక్తిగత సమాచారాన్ని పంచుకోవద్దు.'
  },
  {
    name: 'adangal',
    keywords: ['adangal', 'అడంగల్', 'గ్రామ అడంగల్', 'village adangal', 'మీ అడంగల్', 'aadangal'],
    reply: '📝 Adangal (మీ అడంగల్)\n➡️ Go to the MeeBhoomi portal → Select District → Mandal → Village → Enter Survey No. or Khata No. and click Search.\n\n➡️ మీభూమి పోర్టల్‌లో జిల్లా → మండలం → గ్రామం ఎంపిక చేయండి → సర్వే నెంబరు / ఖాతా నెంబరు నమోదు చేసి శోధన క్లిక్ చేయండి.'
  },
  {
    name: 'ror1b',
    keywords: ['ror1b', '1b', '1-b', 'ఆర్ ఓ ఆర్ 1బి', 'గ్రామ 1బి', 'khata ror', 'ror'],
    reply: '📃 ROR-1B (హక్కుల రికార్డు)\n➡️ Select District → Mandal → Village → Enter Khata No. or Survey No. → Click Search.\n\n➡️ జిల్లా → మండలం → గ్రామం ఎంపిక చేయండి → ఖాతా సంఖ్య లేదా సర్వే నంబర్ నమోదు చేసి శోధన చేయండి.'
  },
  {
    name: 'lp_maps',
    keywords: ['lp maps', 'fmb', 'village map', 'ఎల్ పి మ్యాప్', 'ఎఫ్ ఎంబీ', 'గ్రామ పటం', 'map'],
    reply: '🗺️ LP Maps / FMB (భూమి పార్సెల్ పటం)\n➡️ Select District → Mandal → Village → Enter Survey No. / LP No. → View Cadastral dimensions and boundary coordinates.\n\n➡️ జిల్లా → మండలం → గ్రామం ఎంపిక చేసి సర్వే నంబర్ నమోదు చేసి ఎల్.పీ. సరిహద్దు కొలతలను చూడవచ్చు.'
  },
  {
    name: 'pattadar',
    keywords: ['pattadar', 'పట్టాదారు', 'owner name', 'name wise search', 'pattedar'],
    reply: '📄 Pattadar Details (పట్టాదారు వివరాలు)\n➡️ Search by Pattadar Name in Adangal or 1-B section across your village.\n\n➡️ మీ అడంగల్ లేదా 1-బి విభాగంలో పట్టాదారు పేరు ద్వారా శోధించవచ్చు.'
  },
  {
    name: 'aadhar_link_status',
    keywords: ['aadhar link status', 'ఆధార్ లింకింగ్ స్టేటస్', 'aadhaar link', 'seed status', 'సీడ్ స్టేటస్', 'aadhaar'],
    reply: '🔗 Aadhaar Linking Status (ఆధార్ లింకింగ్ స్థితి)\n➡️ Check if your landholding khata has biometric Aadhaar seeding completed by entering Khata No. or Aadhaar digits.\n\n➡️ ఖాతా సంఖ్య లేదా ఆధార్ సంఖ్య నమోదు చేసి భూమి రికార్డులకు ఆధార్ అనుసంధాన స్థితిని తనిఖీ చేయండి.'
  },
  {
    name: 'epassbook',
    keywords: ['e-passbook', 'epassbook', 'పాస్‌బుక్', 'electronic passbook', 'passbook'],
    reply: '📘 E-Passbook Download (ఎలక్ట్రానిక్ పాస్‌బుక్)\n➡️ Enter Khata No., complete OTP verification, and download your digital Title Deed Passbook with QR code.\n\n➡️ ఖాతా సంఖ్య నమోదు చేసి ధృవీకరణ పూర్తి చేసుకుని అధికారిక ఈ-పాస్‌బుక్ డౌన్‌లోడ్ చేసుకోండి.'
  },
  {
    name: 'mutation_lp_records',
    keywords: ['mutation', 'lp records', 'application status', 'మ్యుటేషన్', 'LP రికార్డు', 'దరఖాస్తు స్థితి'],
    reply: '🔁 Mutation / Application Status (మ్యుటేషన్ దరఖాస్తు స్థితి)\n➡️ Track title deed transfers, corrections, and conversions using your Application Number.\n\n➡️ మీ దరఖాస్తు సంఖ్యను నమోదు చేసి మ్యుటేషన్ పురోగతిని తెలుసుకోండి.'
  },
  {
    name: 'survey_records',
    keywords: ['survey records', 'సర్వే సంఖ్య రికార్డు', 'survey correction', 'syno status'],
    reply: '📚 Survey Records (సర్వే రికార్డులు)\n➡️ View survey sub-division numbers, wet/dry land classification, and water source particulars.\n\n➡️ సర్వే ఉప-విభాగ సంఖ్యలు, మెట్ట/మాగాణి భూమి రకం వివరాలను శోధించండి.'
  },
  {
    name: 'contact_us',
    keywords: ['contact us', 'office address', 'సంప్రదించండి', 'office', 'helpline'],
    reply: '🏢 Office Address / సంప్రదించండి:\nChief Commissioner of Land Administration (CCLA),\nAPIIC Towers, 1st & 3rd Floors, IT Park, Mangalagiri, Guntur - 522503.\n📞 ACB Anti-Corruption Toll Free: 14400\n✉️ Email: ccla-as-cmro@ap.gov.in'
  },
  {
    name: 'goodbye',
    keywords: ['bye', 'goodbye', 'close chat', 'end', 'ధన్యవాదాలు', 'వీడ్కోలు'],
    reply: '👋 Thanks for using MeeBhoomi Chat Assistant!\nమీభూమి డిజిటల్ అసిస్టెంట్‌ను ఉపయోగించినందుకు ధన్యవాదాలు!'
  }
];

export default function Chatbot({ onSelectTab }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: '👋 నమస్కారం! I am your MeeBhoomi Digital Assistant. Ask me about Adangal, 1-B, LP Maps, E-Passbook, or Aadhaar linking.'
    }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      const lower = userMsg.toLowerCase();
      const match = BOT_KNOWLEDGE.find((item) =>
        item.keywords.some((k) => lower.includes(k))
      );
      const reply = match
        ? match.reply
        : 'క్షమించండి, మీ ప్రశ్న అర్థం కాలేదు. దయచేసి "Adangal", "1-B", "LP Map", లేదా "Passbook" వంటి పదాలతో ప్రయత్నించండి.';
      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
    }, 400);
  };

  return (
    <div id="chatbot-widget" className="no-print">
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          backgroundColor: '#145808',
          color: '#ffffff',
          border: '2px solid #ffffff',
          boxShadow: '0 4px 14px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 999999
        }}
        title="MeeBhoomi Assistant"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '90px',
            right: '24px',
            width: '340px',
            height: '460px',
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            zIndex: 999999
          }}
        >
          {/* Header */}
          <div
            style={{
              backgroundColor: '#145808',
              color: '#ffffff',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot size={20} />
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 700 }}>MeeBhoomi Chatbot</h4>
                <span style={{ fontSize: '10px', opacity: 0.85 }}>భూమి రికార్డుల సహాయకుడు</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Privacy Warning */}
          <div style={{ backgroundColor: '#fffbeb', padding: '6px 12px', fontSize: '11px', color: '#92400e', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '1px solid #fef3c7' }}>
            <ShieldAlert size={14} />
            <span>🔒 దయచేసి ఆధార్ లేదా వ్యక్తిగత వివరాలను పంచుకోవద్దు.</span>
          </div>

          {/* Messages list */}
          <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((m, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  lineHeight: '1.4',
                  backgroundColor: m.sender === 'user' ? '#145808' : '#f1f5f9',
                  color: m.sender === 'user' ? '#ffffff' : '#1e293b'
                }}
              >
                {m.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Box */}
          <div style={{ padding: '8px 12px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="మీ ప్రశ్న ఇక్కడ టైప్ చేయండి..."
              style={{
                flex: 1,
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                fontSize: '12px',
                outline: 'none'
              }}
            />
            <button
              onClick={handleSend}
              style={{
                backgroundColor: '#145808',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '8px 12px',
                cursor: 'pointer'
              }}
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
