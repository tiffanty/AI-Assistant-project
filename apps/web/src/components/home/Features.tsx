import Image from "next/image";

const features = [
  {
    title: "Natural Voice AI",
    description: "Advanced speech recognition and natural language processing for human-like conversations",
    icon: "🎯",
  },
  {
    title: "Call Management",
    description: "Automatically handle incoming and outgoing calls with intelligent routing and scheduling",
    icon: "📞",
  },
  {
    title: "Information Extraction",
    description: "AI-powered data collection and organization from every conversation",
    icon: "📊",
  },
  {
    title: "Smart Summaries",
    description: "Generate concise, actionable summaries with key insights and next steps",
    icon: "📝",
  },
  {
    title: "24/7 Availability",
    description: "Your AI assistant works around the clock, never missing important calls",
    icon: "⏰",
  },
  {
    title: "Integration Ready",
    description: "Seamlessly connect with your existing CRM, calendar, and business tools",
    icon: "🔗",
  },
];

const Features = () => {
  return (
    <section id="Features" className="relative py-16 bg-gray-50">
      <div className="container px-2 md:px-0">
        <div className="text-center mb-16">
          <p className="text-black text-[17px] sm:text-3xl not-italic font-medium leading-[90.3%] tracking-[-0.75px] font-montserrat pb-2 sm:pb-[18px]">
            Features
          </p>
          <h3 className="text-black text-3xl sm:text-[57px] not-italic font-medium leading-[90.3%] tracking-[-1.425px] font-montserrat">
            Powerful AI Calling Capabilities
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-[17px] border border-[#B8B5B5] shadow-xl hover:shadow-2xl transition-shadow duration-300"
            >
              <div className="text-6xl mb-6 text-center">{feature.icon}</div>
              <h4 className="text-black text-[24px] sm:text-[32px] not-italic font-medium leading-[90.3%] tracking-[-1.05px] pb-4 font-montserrat text-center">
                {feature.title}
              </h4>
              <p className="font-montserrat text-black text-[17px] sm:text-xl not-italic font-normal leading-[120%] tracking-[-0.5px] text-center">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features; 