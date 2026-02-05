import Link from "next/link";

const pricingPlans = [
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "Perfect for small businesses and individuals",
    features: [
      "100 AI-powered calls per month",
      "Basic call summaries",
      "Email support",
      "Standard integrations",
    ],
    buttonText: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "$99",
    period: "/month",
    description: "Ideal for growing businesses and teams",
    features: [
      "500 AI-powered calls per month",
      "Advanced call analytics",
      "Priority support",
      "Custom integrations",
      "Team management",
    ],
    buttonText: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For large organizations with custom needs",
    features: [
      "Unlimited AI-powered calls",
      "Custom AI training",
      "Dedicated support",
      "White-label solutions",
      "Advanced security",
      "SLA guarantees",
    ],
    buttonText: "Contact Sales",
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section id="Pricing" className="relative py-16 bg-white">
      <div className="container px-2 md:px-0">
        <div className="text-center mb-16">
          <p className="text-black text-[17px] sm:text-3xl not-italic font-medium leading-[90.3%] tracking-[-0.75px] font-montserrat pb-2 sm:pb-[18px]">
            Pricing
          </p>
          <h3 className="text-black text-3xl sm:text-[57px] not-italic font-medium leading-[90.3%] tracking-[-1.425px] font-montserrat">
            Choose Your Plan
          </h3>
          <p className="text-black text-xl sm:text-2xl not-italic font-normal leading-[120%] tracking-[-0.5px] font-montserrat max-w-2xl mx-auto mt-6">
            Start with a free trial and scale as you grow. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <div
              key={index}
              className={`relative bg-white p-8 rounded-[17px] border-2 transition-all duration-300 hover:shadow-2xl ${
                plan.popular
                  ? "border-[#1e3a8a] shadow-xl scale-105"
                  : "border-[#B8B5B5] shadow-lg hover:scale-105"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-[#1e3a8a] text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <h4 className="text-black text-[28px] sm:text-[36px] not-italic font-medium leading-[90.3%] tracking-[-1.05px] font-montserrat pb-2">
                  {plan.name}
                </h4>
                <div className="flex items-baseline justify-center">
                  <span className="text-black text-[32px] sm:text-[48px] not-italic font-bold leading-[90.3%] tracking-[-1.2px] font-montserrat">
                    {plan.price}
                  </span>
                  <span className="text-black text-[16px] sm:text-[20px] not-italic font-normal leading-[90.3%] tracking-[-0.5px] font-montserrat ml-1">
                    {plan.period}
                  </span>
                </div>
                <p className="text-black text-[16px] sm:text-[18px] not-italic font-normal leading-[120%] tracking-[-0.5px] font-montserrat mt-2">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-black text-[16px] sm:text-[18px] not-italic font-normal leading-[120%] tracking-[-0.5px] font-montserrat">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="text-center">
                <Link href="/notes">
                  <button
                    className={`w-full py-4 px-6 rounded-lg font-montserrat text-[16px] sm:text-[18px] not-italic font-semibold leading-[90.3%] tracking-[-0.5px] transition-colors duration-200 ${
                      plan.popular
                        ? "bg-[#1e3a8a] text-white hover:bg-[#243c6c]"
                        : "bg-white text-[#1e3a8a] border-2 border-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white"
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing; 