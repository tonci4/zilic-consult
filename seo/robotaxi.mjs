export const infotainmentPage = {
  path: "/services/infotainment-connected-vehicle/",
  family: "service",
  lastModified: "2026-09-07",
  title: "Infotainment & Connected Vehicle Consultant | Tonći Žilić",
  description: "Tonći Žilić advises on in-vehicle infotainment, automotive HMI, connected services and robotaxi passenger experience, drawing on Rimac and Verne roles.",
  eyebrow: "Infotainment and connected vehicles",
  h1: "Infotainment that connects the vehicle, the passenger and the service.",
  answer: "Tonći Žilić helps automotive and mobility teams define in-vehicle infotainment (IVI), human-machine interfaces (HMI) and connected services as one product experience, from the mobile app to the cabin and cloud.",
  intro: [
    "At Rimac Technology, his product work covered digital services, over-the-air updates, telemetry, apps, cloud and IVI integration with backend services. At Project 3 Mobility, now Verne, he worked on ride experience, including infotainment. He is now Head of Robotaxi at Onde and founder of Žilić Consult.",
    "A display is only one part of infotainment. Product decisions also cover trip information, passenger controls, personalization, connectivity, service assistance and what happens when a vehicle or network cannot deliver the expected experience. In a robotaxi, those interactions also help passengers understand a journey without a driver in the cabin.",
  ],
  situations: [
    "The passenger app, in-vehicle screens and backend describe the same journey differently.",
    "An infotainment roadmap contains features but lacks clear customer needs and priorities.",
    "A robotaxi team needs onboarding, trip status, comfort controls and assistance to work together.",
    "Vehicle, software and cloud teams need agreed interfaces, release dependencies and acceptance criteria.",
  ],
  deliverables: [
    "Infotainment proposition, feature priorities and connected-service roadmap",
    "Passenger journeys across booking, boarding, in-ride experience and arrival",
    "HMI requirements for status, controls, assistance and recovery scenarios",
    "Vehicle, cloud and app dependency map with ownership and acceptance criteria",
    "Validation scenarios for connectivity loss, interrupted updates and service handover",
  ],
  process: "Start with passenger tasks and system states, then map the screens, data, interfaces and owners needed to support them. Prioritize failure and recovery scenarios alongside the normal journey. Engineering teams own implementation and safety validation; the engagement connects product requirements, service behavior and delivery decisions. Availability and any conflicts with the Onde role are reviewed before an engagement.",
  related: ["/about/", "/services/robotaxi-autonomous-mobility/", "/industries/automotive/", "/insights/eu-robotaxi-launch-readiness/"],
  faqs: [
    ["What is in-vehicle infotainment?", "In-vehicle infotainment, often shortened to IVI, combines information, entertainment and connected functions in the vehicle. Product work links those functions to passenger needs, the vehicle interface and the wider digital service."],
    ["How does robotaxi infotainment differ from a conventional vehicle?", "A robotaxi passenger needs clear trip status, destination confirmation, understandable controls and a way to request assistance without relying on a driver. Cabin interfaces and the passenger app should describe the same service state, including delays and interruptions."],
    ["Does this include connected vehicle and software-defined vehicle strategy?", "Yes. Product scope can connect infotainment with apps, cloud services, telemetry and over-the-air updates. The focus is customer value, requirements and delivery priorities across the connected vehicle stack."],
    ["What experience is this based on?", "Tonći Žilić's public career record includes digital services and IVI integration at Rimac Technology and ride experience including infotainment at Project 3 Mobility / Verne. His public Fleet Management – Reinvented talk covers Rimac connectivity, telemetry, apps and OTA updates. Sources are linked below."],
  ],
  sources: [
    { title: "Tonci Zilic — public LinkedIn career record", url: "https://www.linkedin.com/in/tonci4/", note: "First-person career record, checked 7 September 2026." },
    { title: "Fleet Management – Reinvented, WeAreDevelopers World Congress", url: "https://www.wearedevelopers.com/en/videos/473/fleet-management-reinvented", note: "Conference recording, 15 June 2022; connected vehicle and fleet experience." },
  ],
};

export const robotaxiGuide = {
  path: "/insights/eu-robotaxi-launch-readiness/",
  family: "insight",
  lastModified: "2026-09-07",
  datePublished: "2026-09-07",
  title: "EU Robotaxi Launch Readiness: A Checklist | Tonći Žilić",
  description: "A practical European robotaxi launch checklist by Tonći Žilić: operating domain, passenger experience, fleet operations, infotainment and local readiness.",
  eyebrow: "European robotaxi launch planning",
  h1: "What should a robotaxi team resolve before a European city launch?",
  answer: "A European robotaxi launch needs a joined-up service plan: a defined operating domain, a usable passenger journey, fleet and support operations, connected in-cabin systems and a market-specific approval workstream. Vehicle capability is one input to launch readiness.",
  intro: [
    "This is a product and service planning checklist by Tonći Žilić, Head of Robotaxi at Onde and founder of Žilić Consult. It draws on his robotaxi ride-experience work at Project 3 Mobility / Verne and connected vehicle product work at Rimac Technology. It is a professional framework, not an account of Onde's plans or a statement about any operator's deployment status.",
    "For EU robotaxi and autonomous ride-hailing programmes, start with the proposed city and service rather than a country-wide launch label. Define who the service is for, where journeys begin and end, the conditions in which it is intended to operate and who owns the response when a journey cannot continue. Use that definition to test product, commercial and operational assumptions together.",
  ],
  sections: [
    { heading: "1. Define the service and its operating boundaries", paragraphs: [
      "Write down the initial service area, operating hours, pickup and drop-off model, passenger needs and expected trip types. Record the operational design domain (ODD) supplied by the autonomous-driving team and the conditions that limit availability. Product promises should fit those boundaries.",
      "Test a realistic booking against them: can the passenger understand an unavailable destination, an unsuitable pickup point or a service pause? The output is a service definition with explicit exclusions, owners and unresolved assumptions.",
    ] },
    { heading: "2. Design the complete passenger journey", paragraphs: [
      "Connect discovery, booking, vehicle identification, boarding, destination confirmation, the ride and arrival. Review accessibility needs and explain how passengers request support. A journey map should include abandoned bookings, missed pickups, a passenger unable to board and a trip interrupted after departure.",
      "For every scenario, identify what the passenger sees, what the operator sees and which team can act. An attractive booking flow is incomplete if the service cannot explain or resolve a problem during the ride.",
    ] },
    { heading: "3. Connect infotainment, the passenger app and assistance", paragraphs: [
      "Treat robotaxi infotainment as part of the service interface. Trip progress, remaining journey information, comfort controls and assistance requests need consistent meaning across the app, in-vehicle HMI and support tools. Decide which interactions remain available when connectivity is limited.",
      "Document interface ownership and acceptance scenarios across vehicle software, cloud and mobile teams. Review how software updates affect compatible versions and service availability. This turns connected-cabin features into requirements teams can build and verify together.",
    ] },
    { heading: "4. Prove the fleet can support the promised service", paragraphs: [
      "Map dispatch, charging, cleaning, maintenance, vehicle recovery and customer support around the intended operating hours. Define how a vehicle is taken out of service and what conditions allow it to return. Give each exception an owner and a clear handover.",
      "Make utilization and cost assumptions visible. A vehicle that is technically available may still be unavailable to passengers because it needs charging, cleaning or recovery. Review completed journeys, service interruptions, assistance demand and vehicle downtime alongside bookings.",
    ] },
    { heading: "5. Build a market-specific evidence and approval workstream", paragraphs: [
      "Ask the responsible legal, safety and regulatory specialists to identify the requirements for the proposed vehicle, operating model and location. Keep their conclusions distinct from the product checklist. Record the authority, source version, accountable owner and evidence needed for each unresolved decision.",
      "EU automated-driving-system type-approval rules and European Data Protection Board guidance on connected vehicles are useful starting references, linked below. They do not by themselves establish permission to operate a commercial robotaxi service in a particular city. Review passenger, vehicle and support data flows with the responsible privacy specialists as part of service design.",
    ] },
    { heading: "6. Set launch gates around evidence", paragraphs: [
      "Use a readiness review that brings together product, engineering, fleet operations, support and the teams responsible for external approvals. Each gate needs an owner, acceptance evidence, unresolved risks and a decision about the operating scope it supports.",
      "A useful final rehearsal follows an ordinary trip and several disrupted trips through every team. If a handover fails, narrow the proposed service or resolve the gap before treating the plan as ready. Expansion should follow evidence from the initial operation, with the same review applied when the service area or conditions change.",
    ] },
  ],
  situations: [],
  deliverables: [],
  process: "This checklist addresses product and operational planning. It does not certify autonomous-driving safety, interpret a jurisdiction's legal requirements or confirm permission to operate. The cited sources should be checked for updates by the responsible specialists. Views on this consultancy site are Tonći Žilić's own; consulting availability and conflicts are agreed separately.",
  related: ["/about/", "/services/robotaxi-autonomous-mobility/", "/services/infotainment-connected-vehicle/", "/services/market-entry-launch/"],
  faqs: [
    ["Is there one launch checklist for all EU robotaxi markets?", "A shared product framework is useful, but the evidence and approval work must be checked for the proposed vehicle, service and location. This checklist helps organize that work; it does not replace local specialist review."],
    ["What does robotaxi launch readiness measure?", "It tests whether the intended passenger service can be delivered within its defined operating scope, with working support, fleet processes, system interfaces and the necessary evidence from the responsible teams."],
    ["Who is Tonći Žilić?", "Tonći Žilić, also published as Tonci Zilic, is Head of Robotaxi at Onde and founder of Žilić Consult. His background includes robotaxi ride experience and infotainment at Project 3 Mobility / Verne and connected vehicle services at Rimac Technology."],
  ],
  sources: [
    { title: "Tonci Zilic — public LinkedIn career record", url: "https://www.linkedin.com/in/tonci4/", note: "Source for the author's role and professional background; checked 7 September 2026." },
    { title: "EU Regulation 2022/1426 — consolidated 24 March 2026", url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02022R1426-20260324", note: "Automated-driving-system type-approval procedures and technical specifications. Reference for specialist review." },
    { title: "EDPB Guidelines 01/2020 on connected vehicles and mobility applications", url: "https://www.edpb.europa.eu/documents/guideline/guidelines-012020-on-processing-personal-data-in-the-context-of-connected_en", note: "Final guidance on personal-data processing. Reference for privacy specialists." },
  ],
};
