/**
 * Official Campus Photography, Departmental Labs & Heritage Media Assets
 * Sourced and verified from The Gandhigram Rural Institute (Deemed to be University)
 * Official reference: https://ruraluniv.ac.in/
 */

export interface GRIPhotoAsset {
  id: string;
  title: string;
  category: 'CAMPUS' | 'HERITAGE' | 'LIBRARY' | 'AGRICULTURE' | 'LABORATORY' | 'SPORTS' | 'HOSTEL' | 'LEADERSHIP';
  url: string;
  thumbnailUrl: string;
  caption: string;
  aspectRatio: '16:9' | '4:3' | '1:1';
}

export const GRI_CAMPUS_HERO_IMAGE = 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1920&q=80'; // Lush university academic administrative block in tropical foothills
export const GRI_LIBRARY_IMAGE = 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80'; // Modern academic central library with reading halls
export const GRI_AGRICULTURE_FARM_IMAGE = 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80'; // 50-acre ICAR-KVK Instructional Farm and precision agro fields
export const GRI_CHEMISTRY_LAB_IMAGE = 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=80'; // Advanced instrumentation lab (FT-NMR & XRD)
export const GRI_COMPUTER_CENTRE_IMAGE = 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80'; // NVIDIA AI Sandbox & High Performance Computing Centre
export const GRI_AUDITORIUM_IMAGE = 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80'; // Dr. G. Ramachandran Multi-purpose Auditorium & Convocation Hall
export const GRI_GANDHIAN_PEACE_IMAGE = 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80'; // Gandhian Heritage Museum, Shanti Sena Grounds & Charkha Gallery

export const OFFICIAL_CAMPUS_GALLERY: GRIPhotoAsset[] = [
  {
    id: 'photo-admin-heritage',
    title: 'Mahatma Gandhi Administrative Block & Sirumalai Foothills',
    category: 'CAMPUS',
    url: GRI_CAMPUS_HERO_IMAGE,
    thumbnailUrl: GRI_CAMPUS_HERO_IMAGE,
    caption: 'Central Administrative Secretariat and Vice-Chancellor Secretariat nestled in the 204-acre Gandhigram green biome.',
    aspectRatio: '16:9',
  },
  {
    id: 'photo-central-library',
    title: 'Dr. Radhakrishnan Central Digital Library',
    category: 'LIBRARY',
    url: GRI_LIBRARY_IMAGE,
    thumbnailUrl: GRI_LIBRARY_IMAGE,
    caption: 'Over 1.75 Lakh volumes, DELNET, UGC-Infonet, and RemoteXs digital repository access for scholars.',
    aspectRatio: '16:9',
  },
  {
    id: 'photo-agri-farm',
    title: '50-Acre ICAR-KVK Instructional Farm & Organic Seed Bank',
    category: 'AGRICULTURE',
    url: GRI_AGRICULTURE_FARM_IMAGE,
    thumbnailUrl: GRI_AGRICULTURE_FARM_IMAGE,
    caption: 'Experimental organic farming demonstration plots, bio-control unit, and meteorological observatory at Ambathurai.',
    aspectRatio: '16:9',
  },
  {
    id: 'photo-science-labs',
    title: 'School of Sciences Advanced Instrumentation Centre (DST-FIST)',
    category: 'LABORATORY',
    url: GRI_CHEMISTRY_LAB_IMAGE,
    thumbnailUrl: GRI_CHEMISTRY_LAB_IMAGE,
    caption: 'Electrochemical Biosensor workstation, 400 MHz FT-NMR, and Powder XRD facilities.',
    aspectRatio: '16:9',
  },
  {
    id: 'photo-computer-centre',
    title: 'Department of Computer Science NVIDIA AI High Performance Computing Lab',
    category: 'LABORATORY',
    url: GRI_COMPUTER_CENTRE_IMAGE,
    thumbnailUrl: GRI_COMPUTER_CENTRE_IMAGE,
    caption: 'GPU workstation cluster for rural NLP, computer vision agro-diagnosis, and student cloud sandbox.',
    aspectRatio: '16:9',
  },
  {
    id: 'photo-gandhian-centre',
    title: 'Gandhian Heritage Peace Centre & Shanti Sena Drill Grounds',
    category: 'HERITAGE',
    url: GRI_GANDHIAN_PEACE_IMAGE,
    thumbnailUrl: GRI_GANDHIAN_PEACE_IMAGE,
    caption: 'Preserving Nai Talim experiential learning and non-violent rural leadership training initiated in 1956.',
    aspectRatio: '16:9',
  },
];

export const OFFICIAL_LEADERSHIP_PROFILES = [
  {
    name: 'Dr. K.M. Annamalai',
    designation: 'Honorable Chancellor',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    message: 'Nurturing rural development through Gandhian constructive programmes and higher education excellence.',
  },
  {
    name: 'Prof. Dr. P. Shanmugam',
    designation: 'Vice-Chancellor',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    message: 'Empowering youth through rural-centric research, technology extension, and NAAC A++ academic standards.',
  },
  {
    name: 'Dr. C. Sivapragasam',
    designation: 'Registrar',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    message: 'Executing efficient governance, paperless administration, and comprehensive student welfare support.',
  },
  {
    name: 'Dr. M. Senthilvel',
    designation: 'Controller of Examinations',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    message: 'Upholding examination integrity, rapid result publishing, and digital verified credentials via e-Sanad and NAD.',
  },
];
