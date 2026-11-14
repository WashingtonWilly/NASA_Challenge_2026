/**
 * ecuador_dpa.js — División Político-Administrativa del Ecuador (24 provincias, cantones y parroquias)
 * Incluye centroides provinciales de respaldo y vínculos a parcelas demostrativas de AllpaWiñay.
 */
(function (root) {
  'use strict';

  const ECUADOR_PROVINCIAS_CENTRO = {
    AZUAY: [-2.9001, -79.0059],
    BOLIVAR: [-1.5900, -79.0050],
    CANAR: [-2.5597, -78.9386],
    CARCHI: [0.8118, -77.7172],
    CHIMBORAZO: [-1.6709, -78.6471],
    COTOPAXI: [-0.9346, -78.6156],
    'EL ORO': [-3.2581, -79.9554],
    ESMERALDAS: [0.9682, -79.6517],
    GALAPAGOS: [-0.7438, -90.3040],
    GUAYAS: [-2.1894, -79.8891],
    IMBABURA: [0.3499, -78.1263],
    LOJA: [-3.9931, -79.2042],
    'LOS RIOS': [-1.8019, -79.5344],
    MANABI: [-1.0546, -80.4545],
    'MORONA SANTIAGO': [-2.3087, -78.1114],
    NAPO: [-0.9938, -77.8129],
    ORELLANA: [-0.4665, -76.9872],
    PASTAZA: [-1.4882, -78.0031],
    PICHINCHA: [-0.1807, -78.4678],
    'SANTA ELENA': [-2.2269, -80.8587],
    'SANTO DOMINGO DE LOS TSACHILAS': [-0.2531, -79.1754],
    SUCUMBIOS: [0.0887, -76.8943],
    TUNGURAHUA: [-1.2491, -78.6168],
    'ZAMORA CHINCHIPE': [-4.0692, -78.9567]
  };

  const ECUADOR_DPA = {
    AZUAY: {
      Cuenca: ['Cuenca (urbana)', 'Baños', 'Cumbe', 'Chaucha', 'Checa', 'Chiquintad', 'Llacao', 'Molleturo', 'Nulti', 'Octavio Cordero Palacios', 'Paccha', 'Quingeo', 'Ricaurte', 'San Joaquín', 'Santa Ana', 'Sayausí', 'Sidcay', 'Sinincay', 'Tarqui', 'Turi', 'Valle', 'Victoria del Portete'],
      Girón: ['Girón', 'Asunción', 'San Gerardo'],
      Gualaceo: ['Gualaceo', 'Daniel Córdova Toral', 'Jadán', 'Mariano Moreno', 'Remigio Crespo Toral', 'San Juan', 'Zhidmad', 'Luis Cordero Vega', 'Simón Bolívar'],
      Nabón: ['Nabón', 'Cochapata', 'El Progreso', 'Las Nieves'],
      Paute: ['Paute', 'Bulán', 'Chicán', 'El Cabo', 'Guarainag', 'San Cristóbal', 'Tomebamba', 'Dugdug'],
      Pucará: ['Pucará', 'San Rafael de Sharug'],
      'San Fernando': ['San Fernando', 'Chumblín'],
      'Santa Isabel': ['Santa Isabel', 'Abdón Calderón', 'El Carmen de Pijilí', 'Zhaglli'],
      Sigsig: ['Sigsig', 'Cuchil', 'Gima', 'Güel', 'Ludo', 'San Bartolomé', 'San José de Raranga'],
      Oña: ['San Felipe de Oña', 'Susudel'],
      Chordeleg: ['Chordeleg', 'Principal', 'La Unión', 'Luis Galarza Orellana', 'San Martín de Puzhío'],
      'El Pan': ['El Pan', 'San Vicente'],
      'Sevilla de Oro': ['Sevilla de Oro', 'Amaluza', 'Palmas'],
      Guachapala: ['Guachapala'],
      'Camilo Ponce Enríquez': ['Camilo Ponce Enríquez', 'El Carmen de Pijilí']
    },
    BOLIVAR: {
      Guaranda: ['Guaranda', 'Facundo Vela', 'Guanujo', 'Julio E. Moreno', 'Salinas', 'San Lorenzo', 'San Simón', 'Santa Fe', 'Simiátug', 'San Luis de Pambil'],
      Chillanes: ['Chillanes', 'San José del Tambo'],
      Chimbo: ['San José de Chimbo', 'Asunción', 'La Magdalena', 'San Sebastián', 'Telimbela'],
      Echeandía: ['Echeandía'],
      'San Miguel': ['San Miguel', 'Balsapamba', 'Bilován', 'Régulo de Mora', 'San Pablo de Atenas', 'Santiago', 'San Vicente'],
      Caluma: ['Caluma'],
      'Las Naves': ['Las Naves']
    },
    CANAR: {
      Azogues: ['Azogues', 'Cojitambo', 'Guapán', 'Javier Loyola', 'Luis Cordero', 'Pindilig', 'Rivera', 'San Miguel', 'Taday'],
      Biblián: ['Biblián', 'Nazón', 'San Francisco de Sageo', 'Turupamba', 'Jerusalén'],
      Cañar: ['Cañar', 'Chontamarca', 'Chorocopte', 'General Morales', 'Gualleturo', 'Honorato Vásquez', 'Ingapirca', 'Juncal', 'San Antonio', 'Zhud', 'Ventura', 'Ducur'],
      'La Troncal': ['La Troncal', 'Manuel J. Calle', 'Pancho Negro'],
      'El Tambo': ['El Tambo'],
      Déleg: ['Déleg', 'Solano'],
      Suscal: ['Suscal']
    },
    CARCHI: {
      Tulcán: ['Tulcán', 'El Carmelo', 'Julio Andrade', 'Maldonado', 'Pioter', 'Tobar Donoso', 'Tufiño', 'Urbina', 'El Chical', 'Santa Martha de Cuba'],
      Bolívar: ['Bolívar', 'García Moreno', 'Los Andes', 'Monte Olivo', 'San Vicente de Pusir', 'San Rafael'],
      Espejo: ['El Ángel', 'El Goaltal', 'La Libertad', 'San Isidro'],
      Mira: ['Mira', 'Concepción', 'Jijón y Caamaño', 'Juan Montalvo'],
      Montúfar: ['San Gabriel', 'Cristóbal Colón', 'Chitán de Navarrete', 'Fernández Salvador', 'La Paz', 'Piartal'],
      'San Pedro de Huaca': ['Huaca', 'Mariscal Sucre']
    },
    CHIMBORAZO: {
      Riobamba: ['Riobamba (urbana)', 'Cacha', 'Calpi', 'Cubijíes', 'Flores', 'Licán', 'Licto', 'Pungalá', 'Punín', 'Químiag', 'San Juan', 'San Luis'],
      Alausí: ['Alausí', 'Achupallas', 'Guasuntos', 'Huigra', 'Multitud', 'Pistishí', 'Pumallacta', 'Sevilla', 'Sibambe', 'Tixán'],
      Colta: ['Villa La Unión (Cajabamba)', 'Sicalpa', 'Cañi', 'Columbe', 'Juan de Velasco', 'Santiago de Quito'],
      Chambo: ['Chambo'],
      Chunchi: ['Chunchi', 'Capzol', 'Compud', 'Gonzol', 'Llagos'],
      Guamote: ['Guamote', 'Cebadas', 'Palmira'],
      Guano: ['Guano', 'Guanando', 'Ilapo', 'La Providencia', 'San Andrés', 'San Gerardo', 'San Isidro de Patulú', 'San José del Chazo', 'Santa Fe de Galán', 'Valparaíso'],
      Pallatanga: ['Pallatanga'],
      Penipe: ['Penipe', 'El Altar', 'Matus', 'Puela', 'San Antonio de Bayushig', 'La Candelaria', 'Bilbao'],
      Cumandá: ['Cumandá']
    },
    COTOPAXI: {
      Latacunga: ['Latacunga (urbana)', 'Alaques', 'Belisario Quevedo', 'Guaitacama', 'Joseguango Bajo', 'Mulaló', '11 de Noviembre', 'Poaló', 'San Juan de Pastocalle', 'Tanicuchí', 'Toacaso'],
      'La Maná': ['La Maná', 'Guasaganda', 'Pucayacu'],
      Pangua: ['El Corazón', 'Moraspungo', 'Pinllopata', 'Ramón Campaña'],
      Pujilí: ['Pujilí', 'Angamarca', 'Guangaje', 'La Victoria', 'Pilaló', 'Tingo', 'Zumbahua'],
      Salcedo: ['San Miguel de Salcedo', 'Antonio José Holguín', 'Cusubamba', 'Mulalillo', 'Mulliquindil', 'Pansaleo'],
      Saquisilí: ['Saquisilí', 'Canchagua', 'Chantilín', 'Cochapamba'],
      Sigchos: ['Sigchos', 'Chugchilán', 'Isinliví', 'Las Pampas', 'Palo Quemado']
    },
    'EL ORO': {
      Machala: ['Machala (urbana)', 'El Retiro'],
      Arenillas: ['Arenillas', 'Chacras', 'Palmales', 'Carcabón'],
      Atahualpa: ['Paccha', 'Ayapamba', 'Cordoncillo', 'Milagro', 'San José', 'San Juan de Cerro Azul'],
      Balsas: ['Balsas', 'Bellamaría'],
      Chilla: ['Chilla'],
      'El Guabo': ['El Guabo', 'Barbones', 'La Iberia', 'Tendales', 'Río Bonito'],
      Huaquillas: ['Huaquillas'],
      Marcabelí: ['Marcabelí', 'El Ingenio'],
      Pasaje: ['Pasaje', 'Buenavista', 'Casacay', 'La Peaña', 'Progreso', 'Uzhcurrumi', 'Cañaquemada'],
      Piñas: ['Piñas', 'Capiro', 'La Bocana', 'Moromoro', 'Piedras', 'San Roque', 'Saracay'],
      Portovelo: ['Portovelo', 'Curtincapa', 'Morales', 'Salatí'],
      'Santa Rosa': ['Santa Rosa', 'Bellavista', 'Jambelí', 'La Avanzada', 'San Antonio', 'Torata', 'Victoria'],
      Zaruma: ['Zaruma', 'Abañín', 'Arcapamba', 'Guanazán', 'Güizhagüiña', 'Huertas', 'Malvas', 'Muluncay Grande', 'Sinsao', 'Salvias'],
      'Las Lajas': ['La Victoria', 'La Libertad', 'El Paraíso', 'San Isidro']
    },
    ESMERALDAS: {
      Esmeraldas: ['Esmeraldas (urbana)', 'Camarones', 'Coronel Carlos Concha Torres', 'Chinca', 'Majua', 'San Mateo', 'Tabiazo', 'Tachina', 'Vuelta Larga'],
      'Eloy Alfaro': ['Valdez (Limones)', 'Anchayacu', 'Atahualpa', 'Borbón', 'La Tola', 'Luis Vargas Torres', 'Maldonado', 'Pampanal de Bolívar', 'San Francisco de Onzole', 'Santo Domingo de Onzole', 'Selva Alegre', 'Telembí', 'Colón Eloy del María', 'San José de Cayapas', 'Timbiré'],
      Muisne: ['Muisne', 'Bolívar', 'Daule', 'Galera', 'Quingue', 'Salima', 'San Francisco', 'San Gregorio', 'San José de Chamanga'],
      Quinindé: ['Rosa Zárate (Quinindé)', 'Cube', 'Chura', 'Malimpia', 'Viche', 'La Unión'],
      'San Lorenzo': ['San Lorenzo', 'Alto Tambo', 'Ancón', 'Calderón', 'Carondelet', '5 de Junio', 'Concepción', 'Mataje', 'San Javier de Cachaví', 'Santa Rita', 'Tambillo', 'Tululbí', 'Urbina'],
      Atacames: ['Atacames', 'La Unión', 'Súa', 'Tonchigüe', 'Tonsupa'],
      Ríoverde: ['Ríoverde', 'Chontaduro', 'Chumundé', 'Lagarto', 'Montalvo', 'Rocafuerte']
    },
    GALAPAGOS: {
      'San Cristóbal': ['Puerto Baquerizo Moreno', 'El Progreso', 'Isla Santa María (Floreana)'],
      Isabela: ['Puerto Villamil', 'Tomás de Berlanga'],
      'Santa Cruz': ['Puerto Ayora', 'Bellavista', 'Santa Rosa']
    },
    GUAYAS: {
      Guayaquil: ['Guayaquil (urbana)', 'Juan Gómez Rendón (Progreso)', 'Morro', 'Posorja', 'Puná', 'Tenguel'],
      'Alfredo Baquerizo Moreno': ['Alfredo Baquerizo Moreno (Jujan)'],
      Balao: ['Balao'],
      Balzar: ['Balzar'],
      Colimes: ['Colimes', 'San Jacinto'],
      Daule: ['Daule', 'Juan Bautista Aguirre', 'Laurel', 'Limonal', 'Los Lojas'],
      Durán: ['Eloy Alfaro (Durán)'],
      'El Empalme': ['Velasco Ibarra', 'Guayas', 'El Rosario'],
      'El Triunfo': ['El Triunfo'],
      Milagro: ['Milagro', 'Chobo', 'Mariscal Sucre', 'Roberto Astudillo'],
      Naranjal: ['Naranjal', 'Jesús María', 'San Carlos', 'Santa Rosa de Flandes', 'Taura'],
      Naranjito: ['Naranjito'],
      Palestina: ['Palestina'],
      'Pedro Carbo': ['Pedro Carbo', 'Valle de la Virgen', 'Sabanilla'],
      Samborondón: ['Samborondón', 'Tarifa'],
      'Santa Lucía': ['Santa Lucía'],
      Salitre: ['El Salitre', 'General Vernaza', 'La Victoria', 'Junquillal'],
      'San Jacinto de Yaguachi': ['Yaguachi Nuevo', 'General Pedro J. Montero', 'Yaguachi Viejo', 'Virgen de Fátima'],
      Playas: ['General Villamil (Playas)'],
      'Simón Bolívar': ['Simón Bolívar', 'Coronel Lorenzo de Garaicoa'],
      'Coronel Marcelino Maridueña': ['Coronel Marcelino Maridueña'],
      'Lomas de Sargentillo': ['Lomas de Sargentillo'],
      Nobol: ['Narcisa de Jesús (Nobol)'],
      'General Antonio Elizalde': ['General Antonio Elizalde (Bucay)'],
      'Isidro Ayora': ['Isidro Ayora']
    },
    IMBABURA: {
      Ibarra: ['Ibarra (urbana)', 'Ambuquí', 'Angochagua', 'Carolina', 'La Esperanza', 'Lita', 'Salinas', 'San Antonio'],
      'Antonio Ante': ['Atuntaqui', 'Imbaya', 'San Francisco de Natabuela', 'San José de Chaltura', 'San Roque'],
      Cotacachi: ['Cotacachi', 'Apuela', 'García Moreno', 'Imantag', 'Peñaherrera', 'Plaza Gutiérrez', 'Quiroga', '6 de Julio de Cuellaje', 'Vacas Galindo'],
      Otavalo: ['Otavalo', 'Doctor Miguel Egas Cabezas', 'Eugenio Espejo', 'González Suárez', 'Pataquí', 'San José de Quichinche', 'San Juan de Ilumán', 'San Pablo del Lago', 'San Rafael', 'Selva Alegre'],
      Pimampiro: ['Pimampiro', 'Chugá', 'Mariano Acosta', 'San Francisco de Sigsipamba'],
      'San Miguel de Urcuquí': ['Urcuquí', 'Cahuasquí', 'La Merced de Buenos Aires', 'Pablo Arenas', 'San Blas', 'Tumbabiro']
    },
    LOJA: {
      Loja: ['Loja (urbana)', 'Chantaco', 'Chuquiribamba', 'El Cisne', 'Gualel', 'Jimbilla', 'Malacatos', 'San Lucas', 'San Pedro de Vilcabamba', 'Santiago', 'Taquil', 'Vilcabamba', 'Yangana', 'Quinara'],
      Calvas: ['Cariamanga', 'Colaisaca', 'El Lucero', 'Utuana', 'Sanguillín'],
      Catamayo: ['Catamayo', 'El Tambo', 'Guayquichuma', 'San Pedro de la Bendita', 'Zambi'],
      Celica: ['Celica', 'Cruzpamba', 'Pózul', 'Sabanilla', 'Teniente Maximiliano Rodríguez Loaiza'],
      Chaguarpamba: ['Chaguarpamba', 'Buenavista', 'El Rosario', 'Santa Rufina', 'Amarillos'],
      Espíndola: ['Amaluza', 'Bellavista', 'Jimbura', 'Santa Teresita', '27 de Abril', 'El Ingenio', 'El Airo'],
      Gonzanamá: ['Gonzanamá', 'Changaimina', 'Nambacola', 'Purunuma', 'Sacapalca'],
      Macará: ['Macará', 'Larama', 'La Victoria', 'Sabiango'],
      Paltas: ['Catacocha', 'Cangonamá', 'Guachanamá', 'Lauro Guerrero', 'Orianga', 'San Antonio', 'Casanga', 'Yamana'],
      Puyango: ['Alamor', 'Ciano', 'El Arenal', 'El Limo', 'Mercadillo', 'Vicentino'],
      Saraguro: ['Saraguro', 'El Paraíso de Celén', 'El Tablón', 'Lluzhapa', 'Manú', 'San Antonio de Qumbe', 'San Pablo de Tenta', 'San Sebastián de Yúluc', 'Selva Alegre', 'Urdaneta', 'Sumaypamba'],
      Sozoranga: ['Sozoranga', 'Nueva Fátima', 'Tacamoros'],
      Zapotillo: ['Zapotillo', 'Cazaderos', 'Garzareal', 'Limones', 'Paletillas', 'Bolaspamba', 'Mangahurco'],
      Pindal: ['Pindal', 'Chaquinal', '12 de Diciembre', 'Milagros'],
      Quilanga: ['Quilanga', 'Fundochamba', 'San Antonio de las Aradas'],
      Olmedo: ['Olmedo', 'La Tingue']
    },
    'LOS RIOS': {
      Babahoyo: ['Babahoyo (urbana)', 'Caracol', 'Febres Cordero', 'Pimocha', 'La Unión'],
      Baba: ['Baba', 'Guare', 'Isla de Bejucal'],
      Montalvo: ['Montalvo'],
      Puebloviejo: ['Puebloviejo', 'Puerto Pechiche', 'San Juan'],
      Quevedo: ['Quevedo (urbana)', 'La Esperanza', 'San Carlos'],
      Urdaneta: ['Catarama', 'Ricaurte'],
      Ventanas: ['Ventanas', 'Chacarita', 'Los Ángeles', 'Zapotal'],
      Vinces: ['Vinces', 'Antonio Sotomayor'],
      Palenque: ['Palenque'],
      'Buena Fe': ['San Jacinto de Buena Fe', 'Patricia Pilar'],
      Valencia: ['Valencia'],
      Mocache: ['Mocache'],
      Quinsaloma: ['Quinsaloma']
    },
    MANABI: {
      Portoviejo: ['Portoviejo (urbana)', 'Abdón Calderón', 'Alhajuela', 'Crucita', 'Pueblo Nuevo', 'Río Chico', 'San Plácido', 'Chirijos'],
      Bolívar: ['Calceta', 'Membrillo', 'Quiroga'],
      Chone: ['Chone', 'Boyacá', 'Canuto', 'Convento', 'Chibunga', 'Eloy Alfaro', 'Ricaurte', 'San Antonio'],
      'El Carmen': ['El Carmen', 'Wilfrido Loor Moreira', 'San Pedro de Suma'],
      'Flavio Alfaro': ['Flavio Alfaro', 'San Francisco de Novillo', 'Zapallo'],
      Jipijapa: ['Jipijapa', 'América', 'El Anegado', 'Julcuy', 'La Unión', 'Membrillal', 'Pedro Pablo Gómez', 'Puerto Cayo'],
      Junín: ['Junín'],
      Manta: ['Manta (urbana)', 'San Lorenzo', 'Santa Marianita'],
      Montecristi: ['Montecristi', 'La Pila'],
      Paján: ['Paján', 'Campozano', 'Cascol', 'Guale', 'Lascano'],
      Pichincha: ['Pichincha', 'Barraganete', 'San Sebastián'],
      Rocafuerte: ['Rocafuerte'],
      'Santa Ana': ['Santa Ana de Vuelta Larga', 'Ayacucho', 'Honorato Vásquez', 'La Unión', 'San Pablo'],
      Sucre: ['Bahía de Caráquez', 'Charapotó', 'San Isidro'],
      Tosagua: ['Tosagua', 'Bachillero', 'Ángel Pedro Giler'],
      '24 de Mayo': ['Sucre', 'Bellavista', 'Noboa', 'Arquitecto Sixto Durán Ballén'],
      Pedernales: ['Pedernales', 'Cojimíes', '10 de Agosto', 'Atahualpa'],
      Olmedo: ['Olmedo'],
      'Puerto López': ['Puerto López', 'Machalilla', 'Salango'],
      Jama: ['Jama'],
      Jaramijó: ['Jaramijó'],
      'San Vicente': ['San Vicente', 'Canoa']
    },
    'MORONA SANTIAGO': {
      Morona: ['Macas', 'Alshi', 'General Proaño', 'Río Blanco', 'San Isidro', 'Sevilla Don Bosco', 'Sinaí', 'Zuñac', 'Cuchaentza'],
      Gualaquiza: ['Gualaquiza', 'Amazonas', 'Bermejos', 'Bomboiza', 'Chigüinda', 'El Rosario', 'Nueva Tarqui', 'San Miguel de Cuyes', 'El Ideal'],
      'Limón Indanza': ['General Leonidas Plaza Gutiérrez', 'Indanza', 'San Antonio', 'San Miguel de Conchay', 'Santa Susana de Chiviaza', 'Yunganza'],
      Palora: ['Palora', 'Arapicos', 'Cumandá', 'Huamboya', 'Sangay'],
      Santiago: ['Santiago de Méndez', 'Copal', 'Chupianza', 'Patuca', 'San Luis de El Acho', 'Tayuza', 'San Francisco de Chinimbimi'],
      Sucúa: ['Sucúa', 'Asunción', 'Huambi', 'Santa Marianita de Jesús'],
      Huamboya: ['Huamboya', 'Chiguaza'],
      'San Juan Bosco': ['San Juan Bosco', 'Pan de Azúcar', 'San Carlos de Limón', 'San Jacinto de Wakambeis', 'Santiago de Pananza'],
      Taisha: ['Taisha', 'Huasaga', 'Macuma', 'Tuutinentza', 'Pumpuentsa'],
      Logroño: ['Logroño', 'Yaupi', 'Shimpis'],
      'Pablo Sexto': ['Pablo Sexto'],
      Tiwintza: ['Santiago', 'San José de Morona']
    },
    NAPO: {
      Tena: ['Tena', 'Ahuano', 'Chontapunta', 'Pano', 'Puerto Misahuallí', 'Puerto Napo', 'Tálag', 'San Juan de Muyuna'],
      Archidona: ['Archidona', 'Cotundo', 'San Pablo de Ushpayacu', 'Hatun Sumaku'],
      'El Chaco': ['El Chaco', 'Gonzalo Díaz de Pineda', 'Linares', 'Oyacachi', 'Santa Rosa', 'Sardinas'],
      Quijos: ['Baeza', 'Cosanga', 'Cuyuja', 'Papallacta', 'San Francisco de Borja', 'Sumaco'],
      'Carlos Julio Arosemena Tola': ['Carlos Julio Arosemena Tola']
    },
    ORELLANA: {
      Orellana: ['Puerto Francisco de Orellana (El Coca)', 'Dayuma', 'Taracoa', 'Alejandro Labaka', 'El Dorado', 'El Edén', 'García Moreno', 'Inés Arango', 'La Belleza', 'Nuevo Paraíso', 'San José de Guayusa', 'San Luis de Armenia'],
      Aguarico: ['Tiputini', 'Nuevo Rocafuerte', 'Capitán Augusto Rivadeneira', 'Cononaco', 'Santa María de Huiririma', 'Yasuní'],
      'La Joya de los Sachas': ['La Joya de los Sachas', 'Enokanqui', 'Pompeya', 'San Carlos', 'San Sebastián del Coca', 'Lago San Pedro', 'Rumipamba', 'Tres de Noviembre', 'Unión Milagreña'],
      Loreto: ['Loreto', 'Ávila', 'Puerto Murialdo', 'San José de Payamino', 'San José de Dahuano', 'San Vicente de Huaticocha']
    },
    PASTAZA: {
      Pastaza: ['Puyo', 'Canelos', 'Diez de Agosto', 'Fátima', 'Montalvo', 'Pomona', 'Río Corrientes', 'Río Tigre', 'Sarayacu', 'Simón Bolívar', 'Tarqui', 'Teniente Hugo Ortiz', 'Veracruz', 'El Triunfo'],
      Mera: ['Mera', 'Madre Tierra', 'Shell'],
      'Santa Clara': ['Santa Clara', 'San José'],
      Arajuno: ['Arajuno', 'Curaray']
    },
    PICHINCHA: {
      Quito: ['Quito (urbana)', 'Alangasí', 'Amaguaña', 'Atahualpa', 'Calacalí', 'Calderón', 'Conocoto', 'Cumbayá', 'Chavezpamba', 'Checa', 'El Quinche', 'Gualea', 'Guangopolo', 'Guayllabamba', 'La Merced', 'Llano Chico', 'Lloa', 'Nanegal', 'Nanegalito', 'Nayón', 'Nono', 'Pacto', 'Perucho', 'Pifo', 'Píntag', 'Pomasqui', 'Puéllaro', 'Puembo', 'San Antonio', 'San José de Minas', 'Tababela', 'Tumbaco', 'Yaruquí', 'Zámbiza'],
      Cayambe: ['Cayambe', 'Ascázubi', 'Cangahua', 'Olmedo (Pesillo)', 'Otón', 'Santa Rosa de Cuzubamba', 'San José de Ayora'],
      Mejía: ['Machachi', 'Alóag', 'Aloasí', 'Cutuglahua', 'El Chaupi', 'Manuel Cornejo Astorga (Tandapi)', 'Tambillo', 'Uyumbicho'],
      'Pedro Moncayo': ['Tabacundo', 'La Esperanza', 'Malchinguí', 'Tocachi', 'Tupigachi'],
      Rumiñahui: ['Sangolquí', 'Cotogchoa', 'Rumipamba'],
      'San Miguel de los Bancos': ['San Miguel de los Bancos', 'Mindo'],
      'Pedro Vicente Maldonado': ['Pedro Vicente Maldonado'],
      'Puerto Quito': ['Puerto Quito']
    },
    'SANTA ELENA': {
      'Santa Elena': ['Santa Elena', 'Atahualpa', 'Colonche', 'Chanduy', 'Manglaralto', 'Simón Bolívar (Julio Moreno)', 'San José de Ancón'],
      'La Libertad': ['La Libertad'],
      Salinas: ['Salinas', 'Anconcito', 'José Luis Tamayo (Muey)']
    },
    'SANTO DOMINGO DE LOS TSACHILAS': {
      'Santo Domingo': ['Santo Domingo (urbana)', 'Alluriquín', 'El Esfuerzo', 'Luz de América', 'Puerto Limón', 'San Jacinto del Búa', 'Santa María del Toachi', 'Valle Hermoso'],
      'La Concordia': ['La Concordia', 'Monterrey', 'La Villegas', 'Plan Piloto']
    },
    SUCUMBIOS: {
      'Lago Agrio': ['Nueva Loja', 'Dureno', 'General Farfán', 'El Eno', 'Pacayacu', 'Jambelí', 'Santa Cecilia', '10 de Agosto'],
      'Gonzalo Pizarro': ['Lumbaquí', 'El Reventador', 'Gonzalo Pizarro', 'Puerto Libre'],
      Putumayo: ['Puerto El Carmen del Putumayo', 'Palma Roja', 'Puerto Bolívar', 'Puerto Rodríguez', 'Santa Elena'],
      Shushufindi: ['Shushufindi', 'Limoncocha', 'Pañacocha', 'San Roque', 'San Pedro de los Cofanes', 'Siete de Julio'],
      Sucumbíos: ['La Bonita', 'El Playón de San Francisco', 'La Sofía', 'Rosa Florida', 'Santa Bárbara'],
      Cascales: ['El Dorado de Cascales', 'Santa Rosa de Sucumbíos', 'Sevilla'],
      Cuyabeno: ['Tarapoa', 'Cuyabeno', 'Aguas Negras']
    },
    TUNGURAHUA: {
      Ambato: ['Ambato (urbana)', 'Ambatillo', 'Atahualpa', 'Augusto N. Martínez', 'Constantino Fernández', 'Huachi Grande', 'Izamba', 'Juan Benigno Vela', 'Montalvo', 'Pasa', 'Picaigua', 'Pilahuín', 'Quisapincha', 'San Bartolomé de Pinllo', 'San Fernando', 'Santa Rosa', 'Totoras', 'Unamuncho', 'Cunchibamba'],
      'Baños de Agua Santa': ['Baños', 'Lligua', 'Río Negro', 'Río Verde', 'Ulba'],
      Cevallos: ['Cevallos'],
      Mocha: ['Mocha', 'Pinguilí'],
      Patate: ['Patate', 'El Triunfo', 'Los Andes', 'Sucre'],
      'San Pedro de Pelileo': ['Pelileo', 'Benítez', 'Bolívar', 'Cotaló', 'Chiquicha', 'El Rosario', 'García Moreno', 'Guambaló', 'Salasaca'],
      'Santiago de Píllaro': ['Píllaro', 'Baquerizo Moreno', 'Emilio María Terán', 'Marcos Espinel', 'Presidente Urbina', 'San Andrés', 'San José de Poaló', 'San Miguelito'],
      Quero: ['Quero', 'Rumipamba', 'Yanayacu-Mochapata'],
      Tisaleo: ['Tisaleo', 'Quinchicoto']
    },
    'ZAMORA CHINCHIPE': {
      Zamora: ['Zamora', 'Cumbaratza', 'Guadalupe', 'Imbana', 'Sabanilla', 'Timbara', 'San Carlos de las Minas'],
      Chinchipe: ['Zumba', 'Chito', 'El Chorro', 'La Chonta', 'Pucapamba', 'San Andrés'],
      Nangaritza: ['Guayzimi', 'Zurmi', 'Nuevo Paraíso'],
      Yacuambi: ['28 de Mayo', 'La Paz', 'Tutupali'],
      Yantzaza: ['Yantzaza', 'Chicaña', 'Los Encuentros'],
      'El Pangui': ['El Pangui', 'El Guismi', 'Pachicutza', 'Tundayme'],
      'Centinela del Cóndor': ['Zumbi', 'Triunfo Dorado', 'Panguintza'],
      Palanda: ['Palanda', 'El Porvenir del Carmen', 'San Francisco del Vergel', 'Valladolid', 'La Canela'],
      Paquisha: ['Paquisha', 'Bellavista', 'Nuevo Quito']
    }
  };

  // Vínculos directos a las parcelas demostrativas precalculadas
  const PARCELA_POR_UBICACION = {
    'CHIMBORAZO|Riobamba|Licto': 'parcela_chimborazo_1',
    'CHIMBORAZO|Guamote|Guamote': 'parcela_chimborazo_1',
    'EL ORO|El Guabo|El Guabo': 'parcela_el_oro_2',
    'EL ORO|Santa Rosa|Santa Rosa': 'parcela_el_oro_2',
    'CHIMBORAZO|Colta|Villa La Unión (Cajabamba)': 'parcela_colta_3',
    'CHIMBORAZO|Colta|Sicalpa': 'parcela_colta_3'
  };

  root.ECUADOR_DPA = ECUADOR_DPA;
  root.ECUADOR_PROVINCIAS_CENTRO = ECUADOR_PROVINCIAS_CENTRO;
  root.PARCELA_POR_UBICACION = PARCELA_POR_UBICACION;
})(typeof window !== 'undefined' ? window : globalThis);
