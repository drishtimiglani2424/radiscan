import radiusImg from '../assets/images/radius_fracture_xray_1787513329522.jpg';
import scaphoidImg from '../assets/images/scaphoid_xray_1787513291625.jpg';
import shoulderImg from '../assets/images/shoulder_disloc_xray_1787513305201.jpg';
import femurImg from '../assets/images/femur_fracture_xray_1787513316942.jpg';

export const MEDICAL_CASES = [
  {
    id: 'distal-radius-fracture',
    title: 'Distal Radius Fracture (Colles’ Type)',
    shortTitle: 'Distal Radius Fracture',
    category: 'Upper Extremity',
    difficulty: 'Introductory',
    patientAge: '64 yo',
    patientGender: 'Female',
    modality: 'Digital Radiography (DR)',
    projection: 'PA & Lateral Wrist',
    clinicalHistory: 'Patient sustained a mechanical fall onto an outstretched hand (FOOSH) on an icy walkway. Presents with prominent "dinner fork" deformity, marked swelling, and severe dorsal wrist tenderness.',
    imageUrl: radiusImg,
    description: 'Classic extra-articular distal radius metaphyseal fracture with dorsal displacement, apex volar angulation, and associated ulnar styloid avulsion fracture.',
    findings: [
      'Transverse radiolucent fracture line across the distal radial metaphysis approximately 2.2 cm proximal to the radiocarpal joint.',
      'Dorsal tilt measured at 18° (loss of normal 11° volar tilt).',
      'Radial inclination diminished to 14° (normal: 21°–25°).',
      'Radial shortening of 4.5 mm relative to the distal ulna with disrupted positive ulnar variance.',
      'Non-displaced avulsion fracture at the tip of the ulnar styloid process indicating triangular fibrocartilage complex (TFCC) strain.',
      'No gross intra-articular step-off or gap identified along the lunate or scaphoid facets.'
    ],
    impression: 'Extra-articular distal radius fracture with dorsal displacement and angulation (Colles fracture) with associated ulnar styloid avulsion.',
    classification: {
      system: 'AO/OTA Classification',
      type: 'Type 23-A2.2',
      description: 'Extra-articular fracture of the distal radius, metaphyseal simple, with dorsal impaction.'
    },
    measurements: [
      {
        name: 'Dorsal Tilt',
        measuredValue: '18° Dorsal',
        normalRange: '11° Volar (1°–20°)',
        status: 'abnormal',
        interpretation: '29° total loss of anatomical tilt; compromises wrist flexion and increases radiocarpal contact stress.'
      },
      {
        name: 'Radial Inclination',
        measuredValue: '14°',
        normalRange: '21° – 25°',
        status: 'abnormal',
        interpretation: 'Decreased inclination alters load transmission across the carpus.'
      },
      {
        name: 'Radial Height',
        measuredValue: '7 mm',
        normalRange: '11 – 13 mm',
        status: 'abnormal',
        interpretation: 'Shortening of ~5mm creates symptomatic ulnocarpal abutment if not restored.'
      },
      {
        name: 'Ulnar Variance',
        measuredValue: '+3.5 mm',
        normalRange: '-1 to +1 mm',
        status: 'abnormal',
        interpretation: 'Positive variance places excessive stress on the triangular fibrocartilage complex (TFCC).'
      }
    ],
    anatomicalRegions: [
      {
        id: 'distal-radius',
        name: 'Distal Radial Metaphysis',
        latinName: 'Radius distalis',
        description: 'Cancellous bone region vulnerable to compression and tension failure during FOOSH trauma.',
        clinicalSignificance: 'Site of the primary fracture line; requires restoration of length and volar tilt.',
        xPercent: 54,
        yPercent: 62,
        widthPercent: 20,
        heightPercent: 14
      },
      {
        id: 'ulnar-styloid',
        name: 'Ulnar Styloid Process',
        latinName: 'Processus styloideus ulnae',
        description: 'Bony prominence anchoring the TFCC and ulnocarpal ligamentous complex.',
        clinicalSignificance: 'Associated base fractures indicate possible distal radioulnar joint (DRUJ) instability.',
        xPercent: 38,
        yPercent: 58,
        widthPercent: 12,
        heightPercent: 10
      },
      {
        id: 'scaphoid-bone',
        name: 'Scaphoid Carpal Bone',
        latinName: 'Os scaphoideum',
        description: 'Boat-shaped carpal bone articulating with the radial facet.',
        clinicalSignificance: 'Critical to check for concomitant waist fractures in FOOSH injuries.',
        xPercent: 57,
        yPercent: 44,
        widthPercent: 12,
        heightPercent: 10
      },
      {
        id: 'lunate-bone',
        name: 'Lunate Carpal Bone',
        latinName: 'Os lunatum',
        description: 'Moon-shaped bone articulating with the lunate facet of the distal radius.',
        clinicalSignificance: 'Assess for scapholunate dissociation (Terry Thomas sign >3mm) or perilunate dislocation.',
        xPercent: 47,
        yPercent: 48,
        widthPercent: 11,
        heightPercent: 9
      },
      {
        id: 'metacarpals',
        name: 'Metacarpal Bases',
        latinName: 'Ossa metacarpalia',
        description: 'Bases of 1st through 5th metacarpals forming carpometacarpal joints.',
        clinicalSignificance: 'Preserved alignment without dislocation.',
        xPercent: 52,
        yPercent: 24,
        widthPercent: 32,
        heightPercent: 18
      }
    ],
    primaryRoi: {
      xPercent: 36,
      yPercent: 50,
      widthPercent: 34,
      heightPercent: 26,
      label: 'Distal Radius Fracture Zone',
      description: 'Primary zone of cortical breach, metaphyseal comminution, and dorsal displacement.'
    },
    quizQuestions: [
      {
        id: 'q1',
        question: 'Which anatomical landmark measurement is the primary determinant of a Colles fracture deformity on the lateral radiograph?',
        options: [
          'Dorsal tilt / loss of normal volar tilt',
          'Boehler’s angle',
          'Shenton’s line disruption',
          'Baumann’s angle'
        ],
        correctIndex: 0,
        explanation: 'The classic Colles fracture involves dorsal displacement and dorsal angulation of the distal fragment, reversing the normal ~11° volar tilt of the distal radius articular surface.'
      },
      {
        id: 'q2',
        question: 'Which nerve is most commonly compromised acutely in high-energy or severely displaced distal radius fractures?',
        options: [
          'Radial nerve',
          'Median nerve (causing acute Carpal Tunnel Syndrome)',
          'Ulnar nerve in Guyon canal',
          'Musculocutaneous nerve'
        ],
        correctIndex: 1,
        explanation: 'The median nerve courses through the carpal tunnel directly adjacent to the volar aspect of the distal radius. Hematoma or volar translation of fragments can cause acute median neuropathy.'
      },
      {
        id: 'q3',
        question: 'What is the standard acceptable threshold for articular step-off in distal radius fractures to prevent premature post-traumatic osteoarthritis?',
        options: [
          '< 2.0 mm',
          '< 5.0 mm',
          '< 10.0 mm',
          'Any step-off is always acceptable'
        ],
        correctIndex: 0,
        explanation: 'Intra-articular step-off greater than 1 to 2 mm significantly increases the risk of post-traumatic radiocarpal arthritis and long-term wrist pain.'
      }
    ],
    teachingPoints: [
      'Remember the "11-22-11 rule" of the wrist: 11° volar tilt, 22° radial inclination, and 11-12 mm of radial height.',
      'Always examine for associated distal radioulnar joint (DRUJ) instability, especially when ulnar styloid base fracture is present.',
      'Check neurovascular integrity before and after any closed reduction maneuver, paying meticulous attention to median nerve 2-point discrimination in the index finger.',
      'Obtain post-reduction AP and lateral orthogonal views to verify acceptable alignment parameters.'
    ]
  },
  {
    id: 'scaphoid-waist-fracture',
    title: 'Scaphoid Waist Occult Fracture',
    shortTitle: 'Scaphoid Fracture',
    category: 'Upper Extremity',
    difficulty: 'Intermediate',
    patientAge: '24 yo',
    patientGender: 'Male',
    modality: 'Digital Radiography (DR)',
    projection: 'Ulnar Deviation Scaphoid Series',
    clinicalHistory: 'Collegiate rugby player tackled onto hyperextended wrist. Point tenderness in the anatomical snuffbox and pain with axial thumb compression (scaphoid compression test positive). Initial films equivocal.',
    imageUrl: scaphoidImg,
    description: 'Subtle hairline cortical interruption through the waist (middle third) of the scaphoid with intact carpal alignment and preserved scapholunate distance.',
    findings: [
      'Hairline radiolucent line traversing the mid-waist of the scaphoid visible on dedicated ulnar deviation projection.',
      'No evidence of scapholunate dissociation (SL interval measured at 2.1 mm).',
      'Proximal pole maintains normal radiodensity without sclerosis or cystic collapse.',
      'Radiocarpal joint spaces are preserved.'
    ],
    impression: 'Acute non-displaced scaphoid waist fracture. High suspicion for retrograde vascular compromise requiring strict immobilization or percutaneous screw fixation.',
    classification: {
      system: 'Herbert & Fisher Classification',
      type: 'Type B2',
      description: 'Acute unstable/complete waist fracture through the middle third of the scaphoid.'
    },
    measurements: [
      {
        name: 'Scapholunate Interval',
        measuredValue: '2.1 mm',
        normalRange: '1.5 – 2.5 mm',
        status: 'normal',
        interpretation: 'Normal ligamentous integrity; no Terry Thomas sign.'
      },
      {
        name: 'Intrascaphoid Angle',
        measuredValue: '32°',
        normalRange: '< 35°',
        status: 'normal',
        interpretation: 'No humpback flexion deformity identified.'
      }
    ],
    anatomicalRegions: [
      {
        id: 'scaphoid-waist',
        name: 'Scaphoid Waist (Mid-Third)',
        latinName: 'Os scaphoideum pars media',
        description: 'Accounting for ~70% of all scaphoid fractures.',
        clinicalSignificance: 'Vascular supply enters distally; waist fractures put proximal pole at risk of avascular necrosis (AVN).',
        xPercent: 53,
        yPercent: 48,
        widthPercent: 16,
        heightPercent: 14
      },
      {
        id: 'proximal-pole',
        name: 'Proximal Scaphoid Pole',
        latinName: 'Polus proximalis scaphoidei',
        description: 'Articulates with radial scaphoid facet; reliant on retrograde intraosseous flow.',
        clinicalSignificance: 'Watch for progressive sclerosis indicating osteonecrosis.',
        xPercent: 48,
        yPercent: 57,
        widthPercent: 14,
        heightPercent: 12
      },
      {
        id: 'snuffbox-borders',
        name: 'Anatomical Snuffbox Landmark',
        description: 'Bounded by EPL, EPB, and APL tendons.',
        clinicalSignificance: 'Snuffbox tenderness has 90% sensitivity for scaphoid injury.',
        xPercent: 64,
        yPercent: 44,
        widthPercent: 16,
        heightPercent: 14
      }
    ],
    primaryRoi: {
      xPercent: 44,
      yPercent: 40,
      widthPercent: 24,
      heightPercent: 26,
      label: 'Scaphoid Waist Fracture Line',
      description: 'Cortical irregularity through the narrow waist section.'
    },
    quizQuestions: [
      {
        id: 'sq1',
        question: 'Why are fractures of the proximal third of the scaphoid associated with a prolonged healing time and high nonunion rate?',
        options: [
          'Retrograde intraosseous arterial blood supply entering via the dorsal ridge distally',
          'Absence of periosteum on the volar surface only',
          'Direct compression by the median nerve',
          'Excessive mobility of the triquetrum'
        ],
        correctIndex: 0,
        explanation: 'Blood supply to the scaphoid enters predominantly from distal branches of the radial artery. Fractures sever this retrograde supply, leaving proximal fragments ischemic.'
      },
      {
        id: 'sq2',
        question: 'If initial scaphoid radiographs are normal but clinical snuffbox tenderness persists, what is the best immediate management?',
        options: [
          'Immediate unrestricted return to athletics',
          'Thumb spica splinting with repeat radiographs in 10-14 days or urgent non-contrast MRI',
          'Open reduction and internal fixation immediately without imaging',
          'Prescribe NSAIDs only without immobilization'
        ],
        correctIndex: 1,
        explanation: 'Occult scaphoid fractures may take up to 2 weeks to develop visible bone resorption on X-ray. Immobilization plus repeat views or early MRI prevents catastrophic nonunion.'
      }
    ],
    teachingPoints: [
      'Always order a dedicated 4-view Scaphoid Series (AP, Lateral, 30° PA Oblique, and Ulnar Deviation PA).',
      'MRI is the gold standard for detecting occult scaphoid fractures within 24 hours of injury.',
      'Non-displaced fractures can be treated in a thumb spica cast for 6-12 weeks, while athletes often elect headless compression screw (Herbert screw) fixation for faster return to play.'
    ]
  },
  {
    id: 'anterior-shoulder-dislocation',
    title: 'Anterior Glenohumeral Dislocation',
    shortTitle: 'Shoulder Dislocation',
    category: 'Upper Extremity',
    difficulty: 'Introductory',
    patientAge: '28 yo',
    patientGender: 'Male',
    modality: 'Digital Radiography (DR)',
    projection: 'AP, Scapular Y & Axillary Views',
    clinicalHistory: 'Direct blow to an abducted and externally rotated right upper extremity during a basketball game. Acute shoulder pain, inability to internally rotate, and squaring of the lateral deltoid contour.',
    imageUrl: shoulderImg,
    description: 'Subcoracoid anterior dislocation of the humeral head with inferior displacement relative to the glenoid fossa. Hill-Sachs cortical impaction defect noted on the posterosuperior humeral head.',
    findings: [
      'Humeral head is displaced anteriorly and medially, coming to rest beneath the coracoid process (subcoracoid position).',
      'Complete loss of congruency of the glenohumeral articulation on AP and Scapular-Y projections.',
      'Impaction fracture along the posterosuperior aspect of the humeral head (Hill-Sachs lesion).',
      'Small osseous fragment at the anteroinferior rim of the glenoid (Bony Bankart lesion).',
      'Acromioclavicular (AC) joint maintains anatomical relationship.'
    ],
    impression: 'Subcoracoid anterior glenohumeral dislocation with associated Hill-Sachs and Bankart lesions. Pre-reduction neurovascular assessment warranted.',
    classification: {
      system: 'Anatomical Direction',
      type: 'Anterior Subcoracoid',
      description: 'Most common pattern (>95% of shoulder dislocations), driven by abduction and external rotation.'
    },
    measurements: [
      {
        name: 'Glenohumeral Overlap',
        measuredValue: '0 mm (Dislocated)',
        normalRange: '5 – 8 mm overlap on AP',
        status: 'abnormal',
        interpretation: 'Complete disruption of the physiological articulating joint surface.'
      },
      {
        name: 'Humeral Head-Glenoid Center Distance',
        measuredValue: '28 mm Medial',
        normalRange: '0 mm concentric',
        status: 'abnormal',
        interpretation: 'Humeral head positioned medial to the glenoid midline on Y-view.'
      }
    ],
    anatomicalRegions: [
      {
        id: 'humeral-head',
        name: 'Displaced Humeral Head',
        latinName: 'Caput humeri',
        description: 'Articular sphere resting in abnormal subcoracoid space.',
        clinicalSignificance: 'Vulnerable to posterior cortical impaction against hard anterior glenoid rim.',
        xPercent: 44,
        yPercent: 52,
        widthPercent: 24,
        heightPercent: 24
      },
      {
        id: 'glenoid-fossa',
        name: 'Glenoid Fossa',
        latinName: 'Cavitas glenoidalis',
        description: 'Shallow pear-shaped articular socket of the scapula.',
        clinicalSignificance: 'Anteroinferior rim is the site of labral tearing (Bankart lesion).',
        xPercent: 62,
        yPercent: 42,
        widthPercent: 14,
        heightPercent: 20
      },
      {
        id: 'coracoid-process',
        name: 'Coracoid Process',
        latinName: 'Processus coracoideus',
        description: 'Anterior scapular projection anchoring pectoralis minor and conjoint tendon.',
        clinicalSignificance: 'Serves as radiographic landmark for subcoracoid anterior displacement.',
        xPercent: 52,
        yPercent: 30,
        widthPercent: 14,
        heightPercent: 12
      }
    ],
    primaryRoi: {
      xPercent: 36,
      yPercent: 34,
      widthPercent: 38,
      heightPercent: 38,
      label: 'Subcoracoid Dislocation Focus',
      description: 'Humeral head locked medially beneath the coracoid arch.'
    },
    quizQuestions: [
      {
        id: 'sh1',
        question: 'Which nerve must be checked immediately prior to and after reduction of an anterior shoulder dislocation by testing sensation over the "sergeant’s patch" (lateral deltoid)?',
        options: [
          'Axillary nerve',
          'Suprascapular nerve',
          'Long thoracic nerve',
          'Radial nerve'
        ],
        correctIndex: 0,
        explanation: 'The axillary nerve winds around the surgical neck of the humerus in the quadrangular space and is susceptible to traction injury during anterior dislocation and reduction.'
      },
      {
        id: 'sh2',
        question: 'What is a "Hill-Sachs lesion"?',
        options: [
          'A compression fracture of the posterosuperior aspect of the humeral head',
          'A fracture of the clavicular shaft',
          'A tear of the biceps long head tendon',
          'An avulsion of the greater tuberosity only'
        ],
        correctIndex: 0,
        explanation: 'A Hill-Sachs lesion occurs when the soft cancellous bone of the posterolateral humeral head impacts against the hard anterior glenoid rim during anterior dislocation.'
      }
    ],
    teachingPoints: [
      'Never attempt reduction without obtaining adequate orthogonal views (AP and true Scapular Y or Axillary view) to confirm direction and rule out concurrent fracture.',
      'Common reduction techniques include the Cunningham technique, FARES method, Milch technique, and Stimson prone hanging weight.',
      'In young active patients (<25 years), recurrence rate after initial conservative management exceeds 70%, prompting frequent surgical stabilization consideration.'
    ]
  },
  {
    id: 'femoral-neck-fracture',
    title: 'Femoral Neck Intracapsular Fracture',
    shortTitle: 'Femoral Neck Fracture',
    category: 'Lower Extremity',
    difficulty: 'Advanced',
    patientAge: '79 yo',
    patientGender: 'Female',
    modality: 'Digital Radiography (DR)',
    projection: 'AP Pelvis & Cross-table Lateral Hip',
    clinicalHistory: 'Elderly female with known osteopenia tripped over carpet at home. Found on floor unable to bear weight. Right lower extremity appears shortened and externally rotated.',
    imageUrl: femurImg,
    description: 'Displaced subcapital intracapsular fracture of the right femoral neck with disruption of Shenton’s line and severe osteopenia.',
    findings: [
      'Complete subcapital fracture through the narrow femoral neck with superior displacement and external rotation of the shaft.',
      'Disruption of Shenton’s line and the femoral neck-shaft angle (varus collapse <115°).',
      'Trabecular continuity across the femoral head and neck is completely interrupted (Garden Stage IV).',
      'Marked diffuse osteopenia with attenuation of compressive and tensile trabecular lines (Singh Index Grade 2).'
    ],
    impression: 'Garden Stage IV displaced femoral neck fracture. High risk of avascular necrosis and nonunion due to retinacular vessel disruption.',
    classification: {
      system: 'Garden Classification of Femoral Neck Fractures',
      type: 'Garden Stage IV',
      description: 'Completely displaced fracture; femoral head trabeculae maintain normal orientation with the acetabulum while femoral shaft is rotated.'
    },
    measurements: [
      {
        name: 'Neck-Shaft Angle (CCD)',
        measuredValue: '112° (Varus)',
        normalRange: '125° – 135°',
        status: 'abnormal',
        interpretation: 'Varus collapse creates mechanical disadvantage and shear force dominance.'
      },
      {
        name: 'Shenton’s Line Disruption',
        measuredValue: '8 mm Step-off',
        normalRange: 'Continuous smooth arc',
        status: 'abnormal',
        interpretation: 'Clear marker of superior femoral displacement.'
      }
    ],
    anatomicalRegions: [
      {
        id: 'femoral-head',
        name: 'Femoral Head (Caput femoris)',
        latinName: 'Caput femoris',
        description: 'Spherical articular surface seated in acetabulum.',
        clinicalSignificance: 'Medial femoral circumflex artery ascending retinacular branches disrupted.',
        xPercent: 44,
        yPercent: 36,
        widthPercent: 20,
        heightPercent: 20
      },
      {
        id: 'femoral-neck',
        name: 'Femoral Neck Metaphysis',
        latinName: 'Collum femoris',
        description: 'Bridge transferring axial body weight to the femoral shaft.',
        clinicalSignificance: 'Intracapsular location lacks thick periosteum, relying entirely on endosteal healing.',
        xPercent: 50,
        yPercent: 50,
        widthPercent: 18,
        heightPercent: 14
      },
      {
        id: 'greater-trochanter',
        name: 'Greater Trochanter',
        latinName: 'Trochanter major',
        description: 'Lateral bony landmark inserting gluteus medius and minimus.',
        clinicalSignificance: 'Reference for anatomical height and implant entry point.',
        xPercent: 68,
        yPercent: 58,
        widthPercent: 18,
        heightPercent: 16
      }
    ],
    primaryRoi: {
      xPercent: 38,
      yPercent: 36,
      widthPercent: 34,
      heightPercent: 34,
      label: 'Femoral Neck Fracture Zone',
      description: 'Intracapsular cortical step and trabecular shear across the femoral neck.'
    },
    quizQuestions: [
      {
        id: 'fn1',
        question: 'Which main artery provides the primary blood supply to the femoral head in adults and is commonly severed in displaced femoral neck fractures?',
        options: [
          'Medial femoral circumflex artery (deep branch / lateral retinacular arteries)',
          'Obturator artery (ligamentum teres branch only)',
          'Inferior gluteal artery',
          'Lateral femoral cutaneous artery'
        ],
        correctIndex: 0,
        explanation: 'The medial femoral circumflex artery gives off ascending cervical and lateral retinacular branches that provide >80% of the blood supply to the femoral head in mature adults.'
      },
      {
        id: 'fn2',
        question: 'In an active 79-year-old female with a displaced Garden IV femoral neck fracture, what is the surgical treatment of choice according to modern orthopedic guidelines?',
        options: [
          'Hemiarthroplasty or Total Hip Arthroplasty (THA)',
          'Closed reduction and 3 cannulated percutaneous screws',
          '6 weeks of bed rest with skeletal traction',
          'Dynamic Hip Screw (DHS) alone'
        ],
        correctIndex: 0,
        explanation: 'Because of high rates of osteonecrosis (>30%) and nonunion (>25%) with internal fixation in elderly patients with displaced fractures, arthroplasty provides immediate full weight-bearing and superior functional outcomes.'
      }
    ],
    teachingPoints: [
      'Intracapsular fractures lack a cambium layer of periosteum; they heal solely via endosteal callus and synovial fluid can dissolve hematoma formation.',
      'Differentiate intracapsular (subcapital/transcervical) from extracapsular (intertrochanteric/subtrochanteric) fractures because blood supply and implant strategies differ fundamentally.',
      'Postoperative mobilization within 24 hours of hip fracture surgery drastically decreases 30-day mortality, DVT/PE, and pneumonia.'
    ]
  }
];
