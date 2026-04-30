export interface YogaPose {
  id: string;
  name: string;
  hindiName: string;
  description: string;
  benefits: string[];
  steps: string[];
  image: string;
}

export const YOGA_POSES: Record<string, YogaPose> = {
  "surya-namaskar": {
    id: "surya-namaskar",
    name: "Surya Namaskar",
    hindiName: "सूर्य नमस्कार",
    description: "A sequence of 12 powerful yoga poses that provides a great cardiovascular workout.",
    benefits: [
      "Improves blood circulation",
      "Reduces stress",
      "Improves flexibility",
      "Aids in weight loss"
    ],
    steps: [
      "Pranamasana (Prayer pose)",
      "Hasta Uttanasana (Raised arms pose)",
      "Hasta Padasana (Standing forward bend)",
      "Ashwa Sanchalanasana (Equestrian pose)",
      "Dandasana (Stick pose)",
      "Ashtanga Namaskara (Salute with eight points)",
      "Bhujangasana (Cobra pose)",
      "Adho Mukha Svanasana (Downward-facing dog pose)",
      "Ashwa Sanchalanasana (Equestrian pose)",
      "Hasta Padasana (Standing forward bend)",
      "Hasta Uttanasana (Raised arms pose)",
      "Tadasana (Mountain pose)"
    ],
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop"
  },
  "tadasana": {
    id: "tadasana",
    name: "Tadasana",
    hindiName: "ताड़ासन",
    description: "The basic standing pose that forms the foundation for all other standing yoga poses.",
    benefits: [
      "Improves posture",
      "Strengthens thighs, knees, and ankles",
      "Firms abdomen and buttocks",
      "Relieves sciatica"
    ],
    steps: [
      "Stand with feet together",
      "Lift your toes and spread them",
      "Firm your thigh muscles and lift the knee caps",
      "Lengthen your tailbone toward the floor",
      "Lift your chest while keeping shoulders relaxed",
      "Gaze straight ahead and breathe deeply"
    ],
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=1000&auto=format&fit=crop"
  },
  "vrikshasana": {
    id: "vrikshasana",
    name: "Vrikshasana",
    hindiName: "वृक्षासन",
    description: "A balancing pose that helps improve concentration and physical stability.",
    benefits: [
      "Improves balance and stability",
      "Strengthens the legs",
      "Improves concentration",
      "Stretches the thighs and groins"
    ],
    steps: [
      "Stand straight and drop your arms to the sides",
      "Bend your right knee and place the right foot high up on your left thigh",
      "Keep the left leg straight and find your balance",
      "Inhale, and raise your arms over your head",
      "Join your palms in 'Namaste' mudra",
      "Look straight ahead at a distant object for balance"
    ],
    image: "https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=1000&auto=format&fit=crop"
  },
  "adho-mukha-svanasana": {
    id: "adho-mukha-svanasana",
    name: "Adho Mukha Svanasana",
    hindiName: "अधो मुख श्वानासन",
    description: "One of the most recognizable yoga poses, providing a full-body stretch.",
    benefits: [
      "Stretches shoulders, hamstrings, calves, and hands",
      "Strengthens arms and legs",
      "Calms the brain and helps relieve stress",
      "Energizes the body"
    ],
    steps: [
      "Come onto your hands and knees",
      "Set your knees directly below your hips and hands slightly forward of your shoulders",
      "Exhale and lift your knees away from the floor",
      "Lengthen your tailbone away from the back of your pelvis",
      "Lift the sitting bones toward the ceiling",
      "Keep the head between the upper arms; don't let it hang"
    ],
    image: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?q=80&w=1000&auto=format&fit=crop"
  },
  "bhujangasana": {
    id: "bhujangasana",
    name: "Bhujangasana",
    hindiName: "भुजंगासन",
    description: "A backbend that strengthens the spine and stretches the chest and abdomen.",
    benefits: [
      "Strengthens the spine",
      "Stretches chest and lungs, shoulders, and abdomen",
      "Firms the buttocks",
      "Stimulates abdominal organs"
    ],
    steps: [
      "Lie on your stomach with your forehead on the floor",
      "Place your hands under your shoulders",
      "Inhale and slowly lift your chest off the floor",
      "Keep your elbows close to your body",
      "Look upwards and hold the pose",
      "Exhale and slowly lower your chest back to the floor"
    ],
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop"
  }
};
