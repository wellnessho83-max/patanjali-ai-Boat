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
      "Strengthens the heart",
      "Tones digestive system",
      "Improves flexibility",
      "Reduces stress"
    ],
    steps: [
      "Pranamasana (Prayer Pose)",
      "Hastauttanasana (Raised Arms Pose)",
      "Hasta Padasana (Standing Forward Bend)",
      "Ashwa Sanchalanasana (Equestrian Pose)",
      "Dandasana (Stick Pose)",
      "Ashtanga Namaskara (Salute with eight parts)",
      "Bhujangasana (Cobra Pose)",
      "Parvatasana (Mountain Pose)",
      "Ashwa Sanchalanasana (Equestrian Pose)",
      "Hasta Padasana (Standing Forward Bend)",
      "Hastauttanasana (Raised Arms Pose)",
      "Tadasana (Mountain Pose)"
    ],
    image: "https://i.pinimg.com/736x/ff/8d/6a/ff8d6adc3ae12e05ba684730514202e9.jpg"
  },
  "tadasana": {
    id: "tadasana",
    name: "Tadasana",
    hindiName: "Tadasana",
    description: "The basic standing pose that forms the foundation for all other standing yoga poses.",
    benefits: [
      "Improves posture",
      "Strengthens thighs, knees, and ankles",
      "Relieves sciatica",
      "Reduces flat feet"
    ],
    steps: [
      "Stand with feet together or a few inches apart.",
      "Root your feet into the floor.",
      "Lift through the arches of your feet.",
      "Engage your thighs and tuck your tailbone.",
      "Lift your chest and roll your shoulders back.",
      "Reach your arms down toward the floor or up towards the sky."
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
      "Strengthens legs and core",
      "Calms the mind",
      "Increases focus"
    ],
    steps: [
      "Stand tall and find a focal point in front of you.",
      "Shift your weight to your right foot.",
      "Place your left foot on your inner right thigh (avoid the knee).",
      "Bring your hands to prayer position at your chest.",
      "Optional: Reach your arms overhead like branches.",
      "Hold and breathe, then switch sides."
    ],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTak5EDWuJ6FxUPkT2V9xmW18h3iV7F7XMb_A&s"
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
      "Start on your hands and knees.",
      "Tuck your toes and lift your hips toward the ceiling.",
      "Straighten your legs as much as possible without locking knees.",
      "Press your palms firmly into the mat.",
      "Keep your head between your upper arms.",
      "Lengthen your spine and draw your heels toward the floor."
    ],
    image: "https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?q=80&w=1000&auto=format&fit=crop"
  },
  "bhujangasana": {
    id: "bhujangasana",
    name: "Bhujangasana",
    hindiName: "भुजंगासन",
    description: "A backbend that strengthens the spine and stretches the chest and abdomen.",
    benefits: [
      "Strengthens the spine",
      "Stretches chest, lungs, shoulders, and abdomen",
      "Tones the buttocks",
      "Stimulates abdominal organs",
      "Helps relieve stress and fatigue"
    ],
    steps: [
      "Lie face down on the floor.",
      "Place your hands under your shoulders.",
      "Keep your legs together and press the tops of your feet into the mat.",
      "On an inhale, lift your chest off the floor.",
      "Keep your elbows close to your body.",
      "Look slightly upward and breathe."
    ],
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXKCUdi7i6IDaBOU8l7U9RODuGq_8Ab9ULnw&s"
  }
};
