export interface CampusNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  alt?: number;
  floor?: number;
  buildingId?: string;
  isBuilding: boolean;
  description?: string;
}

export interface CampusEdge {
  from: string;
  to: string;
}

export const buildings: CampusNode[] = [
  {
    id: "LAB",
    name: "Lab Complex",
    lat: 23.0786587066161,
    lng: 76.84995795030068,
    description: "Main facility dedicated to practical laboratory sessions and research activities and placement office.",
    isBuilding: true
  },
  {
    id: "ARCH",
    name: "Architecture Building",
    lat: 23.07798049526238,
    lng: 76.85021513805361,
    description: "Academic building housing architecture studios, classrooms, and faculty offices.",
    isBuilding: true
  },
  {
    id: "AB1",
    name: "Academic Block 1",
    lat: 23.07770,
    lng: 76.85143,
    description: "Primary academic block featuring main lecture halls and classrooms.",
    isBuilding: true
  },
  {
    id: "AB2",
    name: "Academic Block 2",
    lat: 23.073777054168755,
    lng: 76.85580691447514,
    description: "Secondary academic block for theoretical classes and seminars.",
    isBuilding: true
  },
  {
    id: "MAYURI",
    name: "Mayuri Cafe",
    lat: 23.077244,
    lng: 76.850605,
    description: "Campus cafeteria providing regular meals, snacks, and beverages.",
    isBuilding: true
  },
  {
    id: "UNDERBELLY",
    name: "Underbelly",
    lat: 23.07757722798361,
    lng: 76.8505391898756,
    description: "Popular student food court and casual social hangout spot.",
    isBuilding: true
  },
  {
    id: "BH1",
    name: "Boys Hostel Block 1",
    lat: 23.07544,
    lng: 76.85992,
    description: "Residential accommodation block for male students.",
    isBuilding: true
  },
  {
    id: "BH2",
    name: "Boys Hostel Block 2",
    lat: 23.072944548713036,
    lng: 76.86009765240127,
    description: "Residential accommodation block for male students.",
    isBuilding: true
  },
  {
    id: "BH3",
    name: "Boys Hostel Block 3",
    lat: 23.07340,
    lng: 76.85938,
    description: "Residential accommodation block for male students.",
    isBuilding: true
  },
  {
    id: "BH4",
    name: "Boys Hostel Block 4",
    lat: 23.07304416561843,
    lng: 76.85878964809127,
    description: "Residential accommodation block for male students.",
    isBuilding: true
  },
  {
    id: "BH5",
    name: "Boys Hostel Block 5",
    lat: 23.073590152644297,
    lng: 76.85874049961807,
    description: "Residential accommodation block for male students.",
    isBuilding: true
  },
  {
    id: "BH6",
    name: "Boys Hostel Block 6",
    lat: 23.072485,
    lng: 76.859904,
    description: "Residential accommodation block for male students.",
    isBuilding: true
  },
  {
    id: "BH7",
    name: "Boys Hostel Block 7",
    lat: 23.07308,
    lng: 76.85941,
    description: "Residential accommodation block for male students.",
    isBuilding: true
  },
  {
    id: "BH8",
    name: "Boys Hostel Block 8",
    lat: 23.072465,
    lng: 76.858838,
    description: "Residential accommodation block for male students.",
    isBuilding: true
  },
  {
    id: "GH1",
    name: "Girls Hostel Block 1",
    lat: 23.07537,
    lng: 76.85250,
    description: "Residential accommodation block for female students.",
    isBuilding: true
  },
  {
    id: "GH2",
    name: "Girls Hostel Block 2",
    lat: 23.07552,
    lng: 76.85378,
    description: "Residential accommodation block for female students.",
    isBuilding: true
  },
  {
    id: "SPECIAL",
    name: "Special Block",
    lat: 23.07251,
    lng: 76.85771,
    description: "Designated facility for specialized academic programs and administrative use.",
    isBuilding: true
  },
  {
    id: "SAFAL",
    name: "safal",
    lat: 23.077436,
    lng: 76.850874,
    description: "On-campus shop supplying stationery, groceries, and daily essentials.",
    isBuilding: true
  },
  {
    id: "PARCEL PICKUP",
    name: "Parcel Pickup Point",
    lat: 23.07456,
    lng: 76.85009,
    description: "Designated open-air area for receiving and collecting courier deliveries.",
    isBuilding: true
  },
  {
    id: "MPH",
    name: "MPH",
    lat: 23.076117405710708,
    lng: 76.8497454307515,
    description: "Multi-Purpose Hall used for indoor sports, large events, and gatherings.",
    isBuilding: true
  },
  {
    id: "HOSPITAL",
    name: "Morphen Hospital",
    lat: 23.076072989049308,
    lng: 76.84975615958747,
    description: "Campus medical center providing primary healthcare and emergency services.",
    isBuilding: true
  },
  {
    id: "CRICKET GROUND",
    name: "cricket ground",
    lat: 23.07452,
    lng: 76.85404,
    description: "cricket ground.",
    isBuilding: true
  },
  {
    id: "GROUND",
    name: "ground",
    lat: 23.07436,
    lng: 76.85966,
    description: "ground.",
    isBuilding: true
  },
  {
    id: "CHANCELLORS HOUSE",
    name: "chancellors residence",
    lat: 23.07496,
    lng: 76.85133,
    description: "chancellors residence.",
    isBuilding: true
  },
  {
    id: "CENTRAL HOSTEL OFFICE",
    name: "central hostel office",
    lat: 23.07369,
    lng: 76.85934,
    description: "central hostel office.",
    isBuilding: true
  },
  {
    id: "MAYURI MESS",
    name: "mayuri mess",
    lat: 23.07360,
    lng: 76.86017,
    description: "mayuri mess.",
    isBuilding: true
  },
  {
    id: "OPEN AUDI",
    name: "open auditorium",
    lat: 23.07432,
    lng: 76.85106,
    description: "open auditorium.",
    isBuilding: true
  }

];

// Hidden Road Junction Nodes (Not shown in dropdown)
export const roadNodes: CampusNode[] = [
  // Academic Zone
  { id: "N1", name: "", lat: 23.077982279812773, lng: 76.85102877484746, isBuilding: false },
  { id: "N2", name: "", lat: 23.077973524610755, lng: 76.85078609616602, isBuilding: false },
  { id: "N3", name: "", lat: 23.077907860577437, lng: 76.85062906878392, isBuilding: false },
  { id: "N4", name: "", lat: 23.077627693675012, lng: 76.85064334400046, isBuilding: false },
  { id: "N5", name: "", lat: 23.07751825332021, lng: 76.85068141124461, isBuilding: false },
  { id: "N6", name: "", lat: 23.07724684085598, lng: 76.8507575457329, isBuilding: false },
  { id: "N7", name: "", lat: 23.077023581805406, lng: 76.85078133776051, isBuilding: false },
  { id: "N8", name: "", lat: 23.07709362390039, lng: 76.85126193671786, isBuilding: false },
  { id: "N48", name: "", lat: 23.077920993386662, lng: 76.85063382718943, isBuilding: false },

  // Architecture & Lab Zone
  { id: "N9", name: "", lat: 23.07898907408047, lng: 76.8505204515349, isBuilding: false },
  { id: "N10", name: "", lat: 23.07831122390035, lng: 76.85059088281884, isBuilding: false },
  { id: "N11", name: "", lat: 23.07818661871603, lng: 76.850152041742, isBuilding: false },
  { id: "N12", name: "", lat: 23.07803709234243, lng: 76.85062880735633, isBuilding: false },

  // Cafeteria Zone
  { id: "N13", name: "", lat: 23.076863445836267, lng: 76.85010791186787, isBuilding: false },
  { id: "N14", name: "", lat: 23.076426175724837, lng: 76.8500856320291, isBuilding: false },
  { id: "N15", name: "", lat: 23.07561312283181, lng: 76.85011533848078, isBuilding: false },
  { id: "N16", name: "", lat: 23.074902551572478, lng: 76.850182177997, isBuilding: false },

  // Central Spine Road
  { id: "N17", name: "", lat: 23.07480689746239, lng: 76.85049409573946, isBuilding: false },
  { id: "N18", name: "", lat: 23.07468391350661, lng: 76.85103623848231, isBuilding: false },
  { id: "N19", name: "", lat: 23.07471124328428, lng: 76.85157838122515, isBuilding: false },
  { id: "N20", name: "", lat: 23.074786400144244, lng: 76.85195713848385, isBuilding: false },
  { id: "N21", name: "", lat: 23.075087027164077, lng: 76.8548238110693, isBuilding: false },
  { id: "N22", name: "", lat: 23.074936284239282, lng: 76.85679124306766, isBuilding: false },

  // Girls Hostel Area
  { id: "N23", name: "", lat: 23.074913123642904, lng: 76.8529165696399, isBuilding: false },
  { id: "N24", name: "", lat: 23.074934454931668, lng: 76.85343246606905, isBuilding: false },
  { id: "N25", name: "", lat: 23.07499844877766, lng: 76.85426717489824, isBuilding: false },
  { id: "N26", name: "", lat: 23.07496111903787, lng: 76.85378605800364, isBuilding: false },

  // AB2 Area
  { id: "N27", name: "", lat: 23.074287628658354, lng: 76.85494398173988, isBuilding: false },
  { id: "N28", name: "", lat: 23.073781895994994, lng: 76.85492160920644, isBuilding: false },
  { id: "N29", name: "", lat: 23.07419070965998, lng: 76.85646519826791, isBuilding: false },
  { id: "N46", name: "", lat: 23.074656901866422, lng: 76.85494500060412, isBuilding: false },
  { id: "N47", name: "", lat: 23.07424808724952, lng: 76.85563883440965, isBuilding: false },

  // East Campus
  { id: "N30", name: "", lat: 23.075016770549855, lng: 76.85626514026693, isBuilding: false },
  { id: "N31", name: "", lat: 23.07494210358325, lng: 76.85734051537067, isBuilding: false },
  { id: "N32", name: "", lat: 23.074904770084405, lng: 76.8584767607633, isBuilding: false },

  // Boys Hostel Ring Road
  { id: "N33", name: "", lat: 23.07494210358325, lng: 76.85965358634851, isBuilding: false },
  { id: "N34", name: "", lat: 23.074447433882458, lng: 76.85846661571514, isBuilding: false },
  { id: "N35", name: "", lat: 23.072953811742167, lng: 76.85836314793916, isBuilding: false },
  { id: "N36", name: "", lat: 23.072891079806613, lng: 76.85888306908957, isBuilding: false },
  { id: "N37", name: "", lat: 23.07289107980566, lng: 76.85929644904398, isBuilding: false },
  { id: "N38", name: "", lat: 23.072757774345465, lng: 76.85957771786308, isBuilding: false },
  { id: "N39", name: "", lat: 23.073933994434118, lng: 76.85842281104532, isBuilding: false },
  { id: "N40", name: "", lat: 23.074130030115498, lng: 76.85840576445024, isBuilding: false },
  { id: "N41", name: "", lat: 23.073788927845918, lng: 76.8598675099797, isBuilding: false },
  { id: "N42", name: "", lat: 23.074867453347775, lng: 76.86000246352658, isBuilding: false },
  { id: "N43", name: "", lat: 23.07335841005969, lng: 76.85838389845556, isBuilding: false },
  { id: "N44", name: "", lat: 23.07372783610921, lng: 76.8583964070395, isBuilding: false },
  { id: "N45", name: "", lat: 23.073616058997267, lng: 76.85983932710948, isBuilding: false },

  // South-East Loop & Connectors
  { id: "N50", name: "", lat: 23.07507709261666, lng: 76.85613788204161, isBuilding: false },
  { id: "N51", name: "", lat: 23.074929784352292, lng: 76.85849257274243, isBuilding: false },
  { id: "N52", name: "", lat: 23.074268722352016, lng: 76.85494235031398, isBuilding: false },
  { id: "N53", name: "", lat: 23.07313991522111, lng: 76.85494419732102, isBuilding: false },
  { id: "N54", name: "", lat: 23.073089802204684, lng: 76.85518386683312, isBuilding: false },
  { id: "N55", name: "", lat: 23.07306975699289, lng: 76.85533638379538, isBuilding: false },
  { id: "N56", name: "", lat: 23.073049711778097, lng: 76.85575035840722, isBuilding: false },
  { id: "N57", name: "", lat: 23.07298957611583, lng: 76.85619701522525, isBuilding: false },
  { id: "N58", name: "", lat: 23.072809168967673, lng: 76.85619701522525, isBuilding: false },
  { id: "N59", name: "", lat: 23.07260871629703, lng: 76.85621880336271, isBuilding: false },
  { id: "N60", name: "", lat: 23.072648523820604, lng: 76.85643829481978, isBuilding: false },
  { id: "N61", name: "", lat: 23.07267997746614, lng: 76.85674599065173, isBuilding: false },
  { id: "N62", name: "", lat: 23.072795307436856, lng: 76.8571106671933, isBuilding: false },
  { id: "N63", name: "", lat: 23.07279994029832, lng: 76.85722591001532, isBuilding: false },
  { id: "N64", name: "", lat: 23.07283954955949, lng: 76.85737659618844, isBuilding: false },
  { id: "N65", name: "", lat: 23.072928670354457, lng: 76.85767796853472, isBuilding: false },
  { id: "N66", name: "", lat: 23.07297818188171, lng: 76.85783941800592, isBuilding: false },
  { id: "N67", name: "", lat: 23.073067344482435, lng: 76.858076129976, isBuilding: false },
  { id: "N68", name: "", lat: 23.073097050140984, lng: 76.85824833561861, isBuilding: false },
  { id: "N69", name: "", lat: 23.073126755792966, lng: 76.85835596414528, isBuilding: false },
  { id: "N70", name: "", lat: 23.073909002267573, lng: 76.85842054126125, isBuilding: false },
  { id: "N71", name: "", lat: 23.074770458311082, lng: 76.85849588122991, isBuilding: false },
  { id: "N72", name: "", lat: 23.07293861988623, lng: 76.85835596414528, isBuilding: false },
  { id: "N73", name: "", lat: 23.0749387881579, lng: 76.85680611336156, isBuilding: false },
  { id: "N74", name: "", lat: 23.07489808958703, lng: 76.85843996840121, isBuilding: false },
  { id: "N75", name: "", lat: 23.074954430477604, lng: 76.85679961223389, isBuilding: false },

  // AB2 Courtyard & Access Points
  { id: "N76", name: "", lat: 23.07465501279135, lng: 76.85492879338743, isBuilding: false },
  { id: "N77", name: "", lat: 23.074425810735235, lng: 76.85493769102376, isBuilding: false },
  { id: "N78", name: "", lat: 23.074278466350062, lng: 76.85515123429596, isBuilding: false },
  { id: "N79", name: "", lat: 23.074303023758787, lng: 76.85520462011402, isBuilding: false },
  { id: "N80", name: "", lat: 23.074262094741737, lng: 76.8549198957511, isBuilding: false },
  { id: "N81", name: "", lat: 23.07424572313143, lng: 76.85581855702156, isBuilding: false },
  { id: "N82", name: "", lat: 23.074098378548943, lng: 76.85492879338743, isBuilding: false },
  { id: "N83", name: "", lat: 23.07427028054615, lng: 76.85503556502353, isBuilding: false }
];

export const campusNodes: CampusNode[] = [...buildings, ...roadNodes];

export const campusEdges: CampusEdge[] = [
  // Building links to nearest road junction
  { from: "LAB", to: "N9" },
  { from: "LAB", to: "N10" },
  { from: "LAB", to: "N11" },
  { from: "ARCH", to: "N11" },
  { from: "ARCH", to: "N12" },
  { from: "AB1", to: "N1" },
  { from: "AB1", to: "N2" },
  { from: "MAYURI", to: "N5" },
  { from: "MAYURI", to: "N6" },
  { from: "UNDERBELLY", to: "N4" },
  { from: "UNDERBELLY", to: "N5" },
  { from: "SAFAL", to: "N5" },
  { from: "SAFAL", to: "N6" },
  { from: "PARCEL PICKUP", to: "N16" },
  { from: "PARCEL PICKUP", to: "N17" },
  { from: "MPH", to: "N14" },
  { from: "HOSPITAL", to: "N14" },
  { from: "GH1", to: "N23" },
  { from: "GH2", to: "N25" },
  { from: "GH2", to: "N26" },
  { from: "SPECIAL", to: "N64" },
  { from: "SPECIAL", to: "N65" },
  { from: "AB2", to: "N78" },
  { from: "AB2", to: "N79" },
  { from: "AB2", to: "N81" },
  { from: "AB2", to: "N83" },
  { from: "AB2", to: "N27" },
  { from: "AB2", to: "N28" },
  { from: "AB2", to: "N47" },

  // AB2 Courtyard Connections
  { from: "N46", to: "N76" },
  { from: "N76", to: "N77" },
  { from: "N77", to: "N80" },
  { from: "N80", to: "N82" },
  { from: "N82", to: "N27" },
  { from: "N77", to: "N83" },
  { from: "N83", to: "N78" },
  { from: "N78", to: "N79" },
  { from: "N79", to: "N47" },
  { from: "N47", to: "N81" },

  { from: "CRICKET GROUND", to: "N20" },
  { from: "CRICKET GROUND", to: "N24" },
  { from: "GROUND", to: "N41" },
  { from: "GROUND", to: "N42" },
  { from: "CHANCELLORS HOUSE", to: "N18" },
  { from: "CHANCELLORS HOUSE", to: "N19" },
  { from: "CENTRAL HOSTEL OFFICE", to: "N43" },
  { from: "CENTRAL HOSTEL OFFICE", to: "N44" },
  { from: "MAYURI MESS", to: "N38" },
  { from: "MAYURI MESS", to: "N41" },
  { from: "OPEN AUDI", to: "N17" },
  { from: "OPEN AUDI", to: "N18" },
  { from: "BH1", to: "N33" },
  { from: "BH1", to: "N42" },
  { from: "BH2", to: "N38" },
  { from: "BH3", to: "N41" },
  { from: "BH3", to: "N45" },
  { from: "BH4", to: "N36" },
  { from: "BH5", to: "N43" },
  { from: "BH5", to: "N44" },
  { from: "BH6", to: "N38" },
  { from: "BH7", to: "N37" },
  { from: "BH8", to: "N36" },

  // Academic & Lab Zone Roads
  { from: "N9", to: "N10" },
  { from: "N10", to: "N11" },
  { from: "N10", to: "N12" },
  { from: "N12", to: "N1" },
  { from: "N1", to: "N2" },
  { from: "N2", to: "N3" },
  { from: "N3", to: "N48" },
  { from: "N48", to: "N4" },
  { from: "N4", to: "N5" },
  { from: "N5", to: "N6" },
  { from: "N6", to: "N7" },
  { from: "N7", to: "N8" },
  { from: "N8", to: "N1" },

  // Cafeteria & South-West Corridor
  { from: "N7", to: "N13" },
  { from: "N13", to: "N14" },
  { from: "N14", to: "N15" },
  { from: "N15", to: "N16" },
  { from: "N16", to: "N17" },

  // Central Spine Road
  { from: "N17", to: "N18" },
  { from: "N18", to: "N19" },
  { from: "N19", to: "N20" },
  { from: "N20", to: "N21" },
  { from: "N21", to: "N22" },

  // Girls Hostel Loop & Detours
  { from: "N20", to: "N23" },
  { from: "N23", to: "N24" },
  { from: "N24", to: "N26" },
  { from: "N26", to: "N25" },
  { from: "N25", to: "N21" },
  { from: "N25", to: "N50" },
  { from: "N24", to: "N50" },
  { from: "N19", to: "N46" },
  { from: "N18", to: "N27" },


  // AB2 Area
  { from: "N21", to: "N46" },
  { from: "N46", to: "N47" },
  { from: "N47", to: "N27" },
  { from: "N27", to: "N28" },
  { from: "N47", to: "N29" },
  { from: "N29", to: "N30" },
  { from: "N28", to: "N52" },
  { from: "N52", to: "N53" },
  { from: "N53", to: "N54" },
  { from: "N54", to: "N55" },
  { from: "N55", to: "N56" },
  { from: "N56", to: "N57" },
  { from: "N57", to: "N58" },
  { from: "N58", to: "N59" },
  { from: "N59", to: "N60" },
  { from: "N60", to: "N61" },
  { from: "N61", to: "N62" },
  { from: "N62", to: "N63" },
  { from: "N63", to: "N64" },
  { from: "N64", to: "N65" },
  { from: "N65", to: "N66" },
  { from: "N66", to: "N67" },
  { from: "N67", to: "N68" },
  { from: "N68", to: "N69" },
  { from: "N69", to: "N72" },
  { from: "N72", to: "N35" },
  { from: "N69", to: "N70" },
  { from: "N70", to: "N71" },

  // East Campus Highway
  { from: "N22", to: "N73" },
  { from: "N73", to: "N75" },
  { from: "N75", to: "N50" },
  { from: "N50", to: "N30" },
  { from: "N30", to: "N31" },
  { from: "N31", to: "N51" },
  { from: "N51", to: "N74" },
  { from: "N74", to: "N71" },
  { from: "N71", to: "N32" },
  { from: "N32", to: "N33" },

  // Boys Hostel Ring Road
  { from: "N32", to: "N34" },
  { from: "N34", to: "N44" },
  { from: "N44", to: "N43" },
  { from: "N43", to: "N35" },
  { from: "N35", to: "N36" },
  { from: "N36", to: "N37" },
  { from: "N37", to: "N38" },
  { from: "N38", to: "N45" },
  { from: "N45", to: "N41" },
  { from: "N41", to: "N42" },
  { from: "N42", to: "N33" },
  { from: "N34", to: "N39" },
  { from: "N39", to: "N40" },
  { from: "N40", to: "N31" },
  { from: "N39", to: "N44" }
];




