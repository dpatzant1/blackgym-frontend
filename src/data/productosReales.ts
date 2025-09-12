// Productos reales basados en GNC Guatemala
// Organizados por categorías con especificaciones detalladas

export interface ProductoCompleto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precio_original?: number;
  stock: number;
  imagen_url: string;
  categoria_id: number;
  categoria_nombre: string;
  marca: string;
  especificaciones: {
    presentacion: string;
    unidades?: number;
    peso?: string;
    sabores?: string[];
    ingredientes_principales: string[];
    beneficios: string[];
    modo_uso: string;
    advertencias?: string;
  };
  etiquetas: string[];
  precio_exclusivo_web?: boolean;
  en_oferta?: boolean;
}

export const PRODUCTOS_REALES: ProductoCompleto[] = [
  // CATEGORÍA: VITAMINAS Y SALUD
  {
    id: 1,
    nombre: "GNC Vitamin D-3 5000 IU",
    descripcion: "Suplemento de Vitamina D3 de alta potencia para fortalecer huesos, sistema inmune y salud general. Esencial para la absorción de calcio.",
    precio: 489.95,
    stock: 25,
    imagen_url: "/productos/GNC Vitamin D-3 5000 IU.png",
    categoria_id: 4,
    categoria_nombre: "Vitaminas y Salud",
    marca: "GNC",
    especificaciones: {
      presentacion: "Cápsulas blandas",
      unidades: 60,
      ingredientes_principales: ["Vitamina D3 (Colecalciferol) 5000 IU"],
      beneficios: [
        "Fortalece huesos y dientes",
        "Mejora el sistema inmunológico",
        "Favorece la absorción de calcio",
        "Apoya la función muscular",
        "Mejora el estado de ánimo"
      ],
      modo_uso: "Tomar 1 cápsula al día con alimento"
    },
    etiquetas: ["vitamina d", "inmunidad", "huesos", "premium"],
    precio_exclusivo_web: true
  },
  
  {
    id: 2,
    nombre: "GNC Magnesium 500 mg",
    descripcion: "Magnesio quelado de alta absorción para función muscular, nerviosa y cardiovascular óptima. Ideal para deportistas y personas activas.",
    precio: 265.95,
    stock: 30,
    imagen_url: "/productos/GNC Magnesium 500 mg.png",
    categoria_id: 4,
    categoria_nombre: "Vitaminas y Salud",
    marca: "GNC",
    especificaciones: {
      presentacion: "Tabletas",
      unidades: 90,
      ingredientes_principales: ["Magnesio (como Óxido de Magnesio) 500mg"],
      beneficios: [
        "Relajación muscular",
        "Función nerviosa saludable",
        "Salud cardiovascular",
        "Metabolismo energético",
        "Reduce calambres musculares"
      ],
      modo_uso: "Tomar 1 tableta diaria, preferiblemente con alimento"
    },
    etiquetas: ["magnesio", "músculos", "relajación", "deportistas"],
    precio_exclusivo_web: true
  },

  {
    id: 3,
    nombre: "GNC Zinc 30 mg",
    descripcion: "Zinc esencial para función inmune, cicatrización de heridas y síntesis de proteínas. Fundamental para la salud de la piel.",
    precio: 94.95,
    stock: 40,
    imagen_url: "/productos/GNC Zinc 30 mg.png",
    categoria_id: 4,
    categoria_nombre: "Vitaminas y Salud",
    marca: "GNC",
    especificaciones: {
      presentacion: "Tabletas",
      unidades: 100,
      ingredientes_principales: ["Zinc (como Gluconato de Zinc) 30mg"],
      beneficios: [
        "Fortalece el sistema inmune",
        "Mejora la cicatrización",
        "Salud de la piel",
        "Síntesis de proteínas",
        "Antioxidante natural"
      ],
      modo_uso: "Tomar 1 tableta diaria con el estómago vacío"
    },
    etiquetas: ["zinc", "inmunidad", "piel", "económico"],
    precio_exclusivo_web: true
  },

  {
    id: 4,
    nombre: "GNC Women's Multivitamin - Ultra Mega",
    descripcion: "Multivitamínico completo diseñado específicamente para las necesidades nutricionales de la mujer moderna.",
    precio: 244.97,
    precio_original: 332.45,
    stock: 20,
    imagen_url: "/productos/GNC Women's Multivitamin - Ultra Mega.PNG",
    categoria_id: 4,
    categoria_nombre: "Vitaminas y Salud",
    marca: "GNC",
    especificaciones: {
      presentacion: "Tabletas",
      unidades: 90,
      ingredientes_principales: [
        "Vitamina A, C, D, E",
        "Complejo B completo",
        "Hierro",
        "Calcio",
        "Ácido Fólico"
      ],
      beneficios: [
        "Energía y vitalidad diaria",
        "Salud hormonal femenina",
        "Belleza de piel, cabello y uñas",
        "Apoyo durante el ciclo menstrual",
        "Antioxidantes potentes"
      ],
      modo_uso: "Tomar 1 tableta dos veces al día con alimentos"
    },
    etiquetas: ["mujeres", "multivitamínico", "energía", "oferta"],
    precio_exclusivo_web: true,
    en_oferta: true
  },

  // CATEGORÍA: PROTEÍNAS
  {
    id: 5,
    nombre: "Dymatize® ISO100® Hydrolyzed 5 Lbs",
    descripcion: "Proteína whey hidrolizada de absorción ultra rápida. La proteína más pura del mercado con 25g de proteína por porción.",
    precio: 907.20,
    stock: 15,
    imagen_url: "/productos/Dymatize® ISO100® Hydrolyzed 5 Lbs.png",
    categoria_id: 1,
    categoria_nombre: "Proteínas",
    marca: "Dymatize",
    especificaciones: {
      presentacion: "Polvo",
      peso: "5 libras (2.3 kg)",
      sabores: ["Chocolate", "Vainilla", "Fresa", "Cookies & Cream"],
      ingredientes_principales: [
        "Proteína Whey Hidrolizada",
        "Aminoácidos BCAA",
        "Glutamina natural"
      ],
      beneficios: [
        "Absorción ultra rápida",
        "Construcción muscular magra",
        "Recuperación acelerada",
        "Sin lactosa ni grasa",
        "Ideal post-entrenamiento"
      ],
      modo_uso: "Mezclar 1 scoop (30g) con 200ml de agua fría después del entrenamiento"
    },
    etiquetas: ["proteína", "hidrolizada", "premium", "post-workout"]
  },

  {
    id: 6,
    nombre: "Muscletech® Nitro Tech™ 4 Lbs",
    descripcion: "Proteína whey premium con creatina y aminoácidos. Fórmula científicamente probada para construcción muscular superior.",
    precio: 747.60,
    stock: 18,
    imagen_url: "/productos/Muscletech® Nitro Tech™ 4 Lbs.png",
    categoria_id: 1,
    categoria_nombre: "Proteínas",
    marca: "MuscleTech",
    especificaciones: {
      presentacion: "Polvo",
      peso: "4 libras (1.8 kg)",
      sabores: ["Chocolate", "Vainilla", "Fresa", "Cookies & Cream"],
      ingredientes_principales: [
        "Proteína Whey Isolate",
        "Creatina Monohidrato",
        "BCAA y Glutamina",
        "Alanina"
      ],
      beneficios: [
        "Construcción muscular acelerada",
        "Mayor fuerza y potencia",
        "Recuperación mejorada",
        "Investigación clínica respaldada",
        "Sabor superior"
      ],
      modo_uso: "Mezclar 1 scoop con 180ml de agua o leche, 2-3 veces al día"
    },
    etiquetas: ["proteína", "creatina", "fuerza", "investigado"],
    precio_exclusivo_web: true
  },

  // CATEGORÍA: SNACKS
  {
    id: 7,
    nombre: "One® Protein Bar (60g)",
    descripcion: "Barra proteica deliciosa con 20g de proteína y sabor increíble. Perfecta para snack saludable entre comidas.",
    precio: 19.95,
    stock: 100,
    imagen_url: "/productos/One® Protein Bar (60g).png",
    categoria_id: 8,
    categoria_nombre: "Snacks",
    marca: "One",
    especificaciones: {
      presentacion: "Barra individual",
      peso: "60g",
      sabores: [
        "Chocolate Brownie",
        "Cookies & Cream",
        "Birthday Cake",
        "Maple Glazed Doughnut",
        "Peanut Butter Pie"
      ],
      ingredientes_principales: [
        "20g Proteína de suero",
        "1g Azúcar",
        "Fibra prebiótica",
        "Sabores naturales"
      ],
      beneficios: [
        "Alto contenido proteico",
        "Bajo en azúcar",
        "Sabor excepcional",
        "Portátil y conveniente",
        "Saciante"
      ],
      modo_uso: "Consumir como snack entre comidas o post-entrenamiento"
    },
    etiquetas: ["barra", "proteína", "snack", "bajo azúcar"]
  },

  {
    id: 8,
    nombre: "GNC Total Lean® Lean Bar",
    descripcion: "Barra nutricional diseñada para control de peso con proteína de calidad y fibra. Ideal para dietas de definición.",
    precio: 19.90,
    stock: 80,
    imagen_url: "/productos/GNC Total Lean® Lean Bar.png",
    categoria_id: 8,
    categoria_nombre: "Snacks",
    marca: "GNC",
    especificaciones: {
      presentacion: "Barra individual",
      ingredientes_principales: [
        "Proteína de suero y caseína",
        "Fibra soluble",
        "Vitaminas y minerales",
        "Probióticos"
      ],
      beneficios: [
        "Control del apetito",
        "Apoyo en pérdida de peso",
        "Digestión saludable",
        "Energía sostenida",
        "Nutrición completa"
      ],
      modo_uso: "Consumir como reemplazo de snack o entre comidas"
    },
    etiquetas: ["lean", "control peso", "fibra", "probióticos"],
    precio_exclusivo_web: true
  },

  // CATEGORÍA: PÉRDIDA Y CONTROL DE PESO
  {
    id: 9,
    nombre: "GNC Total Lean® CLA",
    descripcion: "Ácido linoleico conjugado para apoyo en la composición corporal y mantenimiento de masa muscular magra.",
    precio: 399.95,
    stock: 22,
    imagen_url: "/productos/GNC Total Lean® CLA.png",
    categoria_id: 3,
    categoria_nombre: "Pérdida y Control de Peso",
    marca: "GNC",
    especificaciones: {
      presentacion: "Cápsulas blandas",
      unidades: 90,
      ingredientes_principales: [
        "CLA (Ácido Linoleico Conjugado) 1000mg",
        "Aceite de cártamo"
      ],
      beneficios: [
        "Apoya la composición corporal",
        "Mantiene masa muscular magra",
        "Metabolismo de grasas",
        "Antioxidante natural",
        "Sin estimulantes"
      ],
      modo_uso: "Tomar 1 cápsula 3 veces al día con comidas"
    },
    etiquetas: ["CLA", "composición corporal", "masa magra", "natural"]
  },

  // CATEGORÍA: PRODUCTOS HERBALES
  {
    id: 10,
    nombre: "GNC Herbal Plus® Ashwagandha Extract 470 mg",
    descripcion: "Extracto estandarizado de Ashwagandha para manejo del estrés, energía y bienestar general. Adaptógeno natural.",
    precio: 274.95,
    stock: 35,
    imagen_url: "/productos/GNC Herbal Plus® Ashwagandha Extract 470 mg.png",
    categoria_id: 6,
    categoria_nombre: "Productos Herbales",
    marca: "GNC",
    especificaciones: {
      presentacion: "Cápsulas vegetales",
      unidades: 60,
      ingredientes_principales: [
        "Ashwagandha Extract (Withania somnifera) 470mg",
        "Estandarizado al 2.5% withanólidos"
      ],
      beneficios: [
        "Manejo del estrés",
        "Energía y vitalidad",
        "Mejora el sueño",
        "Función cognitiva",
        "Adaptógeno natural"
      ],
      modo_uso: "Tomar 1 cápsula dos veces al día con alimento"
    },
    etiquetas: ["ashwagandha", "estrés", "adaptógeno", "natural"]
  },

  // CATEGORÍA: NUTRICIÓN VIDA ACTIVA
  {
    id: 11,
    nombre: "GNC Triple Strength Omega Complex",
    descripcion: "Complejo de omega 3-6-9 de triple potencia para salud cardiovascular, cerebral y articular. Aceites premium purificados.",
    precio: 374.25,
    stock: 28,
    imagen_url: "/productos/GNC Triple Strength Omega Complex.png",
    categoria_id: 2,
    categoria_nombre: "Nutrición Vida Activa",
    marca: "GNC",
    especificaciones: {
      presentacion: "Cápsulas blandas",
      unidades: 60,
      ingredientes_principales: [
        "EPA 647mg",
        "DHA 253mg",
        "Omega-6 (GLA)",
        "Omega-9 (Ácido Oleico)"
      ],
      beneficios: [
        "Salud cardiovascular",
        "Función cerebral óptima",
        "Articulaciones saludables",
        "Piel y cabello radiantes",
        "Antiinflamatorio natural"
      ],
      modo_uso: "Tomar 1-2 cápsulas diariamente con comida"
    },
    etiquetas: ["omega", "cardiovascular", "cerebro", "articulaciones"]
  },

  // CATEGORÍA: BELLEZA Y BIENESTAR
  {
    id: 12,
    nombre: "GNC Women's Collagen",
    descripcion: "Colágeno hidrolizado especialmente formulado para mujeres con vitaminas y minerales para belleza integral.",
    precio: 449.95,
    stock: 20,
    imagen_url: "/productos/GNC Women's Collagen.png",
    categoria_id: 5,
    categoria_nombre: "Belleza y Bienestar",
    marca: "GNC",
    especificaciones: {
      presentacion: "Polvo soluble",
      peso: "300g",
      sabores: ["Berry", "Tropical"],
      ingredientes_principales: [
        "Colágeno hidrolizado 10g",
        "Vitamina C",
        "Biotina",
        "Ácido hialurónico",
        "Ceramidas"
      ],
      beneficios: [
        "Piel firme y radiante",
        "Cabello fuerte y brillante",
        "Uñas saludables",
        "Hidratación profunda",
        "Antienvejecimiento"
      ],
      modo_uso: "Mezclar 1 scoop con 250ml de agua fría, una vez al día"
    },
    etiquetas: ["colágeno", "belleza", "piel", "mujeres"]
  },

  // MULTIVITAMÍNICOS PARA HOMBRES
  {
    id: 13,
    nombre: "GNC Mega Men® Sport Multivitamin",
    descripcion: "Multivitamínico premium diseñado para hombres activos y deportistas. Fórmula con cafeína y antioxidantes.",
    precio: 515.96,
    precio_original: 644.95,
    stock: 15,
    imagen_url: "/productos/GNC Mega Men® Sport Multivitamin.png",
    categoria_id: 4,
    categoria_nombre: "Vitaminas y Salud",
    marca: "GNC",
    especificaciones: {
      presentacion: "Tabletas",
      unidades: 90,
      ingredientes_principales: [
        "Vitaminas A, C, D, E",
        "Complejo B completo",
        "Cafeína natural 100mg",
        "Creatina",
        "Antioxidantes deportivos"
      ],
      beneficios: [
        "Energía y resistencia",
        "Recuperación muscular",
        "Función inmune deportiva",
        "Metabolismo optimizado",
        "Rendimiento atlético"
      ],
      modo_uso: "Tomar 1 tableta dos veces al día con alimentos"
    },
    etiquetas: ["hombres", "deporte", "energía", "oferta"],
    precio_exclusivo_web: true,
    en_oferta: true
  },

  // ENZIMAS Y DIGESTIÓN
  {
    id: 14,
    nombre: "GNC Digestive Health Probiotic Complex",
    descripcion: "Complejo probiótico avanzado con 15 mil millones de cultivos vivos para salud digestiva e inmune óptima.",
    precio: 334.95,
    stock: 25,
    imagen_url: "/productos/GNC Digestive Health Probiotic Complex.png",
    categoria_id: 9,
    categoria_nombre: "Enzimas y Digestión",
    marca: "GNC",
    especificaciones: {
      presentacion: "Cápsulas entéricas",
      unidades: 30,
      ingredientes_principales: [
        "15 mil millones de cultivos vivos",
        "12 cepas probióticas diferentes",
        "Prebióticos (inulina)",
        "Enzimas digestivas"
      ],
      beneficios: [
        "Digestión saludable",
        "Sistema inmune fuerte",
        "Absorción de nutrientes",
        "Balance intestinal",
        "Reducción de inflamación"
      ],
      modo_uso: "Tomar 1 cápsula diaria con el estómago vacío"
    },
    etiquetas: ["probióticos", "digestión", "inmunidad", "intestinal"]
  },

  // ACCESORIOS FITNESS
  {
    id: 15,
    nombre: "Shaker Bottle Black Gym Premium",
    descripcion: "Botella mezcladora premium de 600ml con compartimento para suplementos. Libre de BPA, perfecta para proteínas.",
    precio: 89.95,
    stock: 50,
    imagen_url: "/productos/Shaker Bottle Black Gym Premium.png",
    categoria_id: 10,
    categoria_nombre: "Accesorios",
    marca: "Black Gym",
    especificaciones: {
      presentacion: "Botella con mezclador",
      ingredientes_principales: [
        "Material libre de BPA",
        "Tapa a prueba de derrames",
        "Compartimento para suplementos",
        "Rejilla mezcladora de acero"
      ],
      beneficios: [
        "Mezcla perfecta sin grumos",
        "Portátil y conveniente",
        "Fácil limpieza",
        "Durabilidad premium",
        "Diseño ergonómico"
      ],
      modo_uso: "Agregar líquido, suplemento, agitar y disfrutar"
    },
    etiquetas: ["shaker", "accesorio", "premium", "fitness"]
  }
];

export const CATEGORIAS = [
  { id: 1, nombre: "Proteínas", descripcion: "Suplementos proteínicos para desarrollo muscular" },
  { id: 2, nombre: "Nutrición Vida Activa", descripcion: "Suplementos para estilo de vida saludable" },
  { id: 3, nombre: "Pérdida y Control de Peso", descripcion: "Productos para manejo de peso corporal" },
  { id: 4, nombre: "Vitaminas y Salud", descripcion: "Suplementos vitamínicos y de salud" },
  { id: 5, nombre: "Belleza y Bienestar", descripcion: "Productos para belleza y bienestar integral" },
  { id: 6, nombre: "Productos Herbales", descripcion: "Suplementos naturales y herbales" },
  { id: 7, nombre: "Niños y Adolescentes", descripcion: "Productos especializados para jóvenes" },
  { id: 8, nombre: "Snacks", descripcion: "Snacks y barras nutritivas" },
  { id: 9, nombre: "Enzimas y Digestión", descripcion: "Productos para salud digestiva" },
  { id: 10, nombre: "Accesorios", descripcion: "Accesorios para entrenamiento" }
];
