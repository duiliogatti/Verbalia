import type { Concept, Level, PartOfSpeech, Topic } from './types';

// Starter word list. Each row: id, level, topic, part of speech, then word and
// example sentence for en, es and fr. Nouns carry their article so learners
// pick up gender; typing answers are accepted with or without it.
//
// Before release every language needs a review by a native speaker.
type Row = [
  string, Level, Topic, PartOfSpeech,
  string, string,
  string, string,
  string, string,
];

const ROWS: Row[] = [
  // A1 · basics
  ['hello', 'A1', 'basics', 'phrase', 'hello', 'Hello, how are you?', 'hola', 'Hola, ¿cómo estás?', 'bonjour', 'Bonjour, comment ça va ?'],
  ['thank_you', 'A1', 'basics', 'phrase', 'thank you', 'Thank you for your help.', 'gracias', 'Gracias por tu ayuda.', 'merci', 'Merci pour ton aide.'],
  ['please', 'A1', 'basics', 'phrase', 'please', 'A coffee, please.', 'por favor', 'Un café, por favor.', "s'il vous plaît", "Un café, s'il vous plaît."],
  ['goodbye', 'A1', 'basics', 'phrase', 'goodbye', 'Goodbye, see you tomorrow.', 'adiós', 'Adiós, hasta mañana.', 'au revoir', 'Au revoir, à demain.'],
  ['sorry', 'A1', 'basics', 'phrase', 'sorry', "Sorry, I'm late.", 'perdón', 'Perdón, llego tarde.', 'désolé', 'Désolé, je suis en retard.'],
  ['name', 'A1', 'basics', 'noun', 'name', 'What is your name?', 'el nombre', '¿Cuál es tu nombre?', 'le nom', 'Quel est ton nom ?'],
  ['friend', 'A1', 'basics', 'noun', 'friend', 'He is my best friend.', 'el amigo', 'Él es mi mejor amigo.', "l'ami", "C'est mon meilleur ami."],
  // A1 · people
  ['mother', 'A1', 'people', 'noun', 'mother', 'My mother is a doctor.', 'la madre', 'Mi madre es médica.', 'la mère', 'Ma mère est médecin.'],
  ['father', 'A1', 'people', 'noun', 'father', 'My father cooks every day.', 'el padre', 'Mi padre cocina todos los días.', 'le père', 'Mon père cuisine tous les jours.'],
  ['brother', 'A1', 'people', 'noun', 'brother', 'I have one brother.', 'el hermano', 'Tengo un hermano.', 'le frère', "J'ai un frère."],
  ['sister', 'A1', 'people', 'noun', 'sister', 'My sister lives in Paris.', 'la hermana', 'Mi hermana vive en París.', 'la sœur', 'Ma sœur habite à Paris.'],
  ['child', 'A1', 'people', 'noun', 'child', 'The child is playing.', 'el niño', 'El niño está jugando.', "l'enfant", "L'enfant joue."],
  ['woman', 'A1', 'people', 'noun', 'woman', 'The woman is reading a book.', 'la mujer', 'La mujer lee un libro.', 'la femme', 'La femme lit un livre.'],
  ['man', 'A1', 'people', 'noun', 'man', 'The man is tall.', 'el hombre', 'El hombre es alto.', "l'homme", "L'homme est grand."],
  // A1 · food
  ['water', 'A1', 'food', 'noun', 'water', 'I drink water.', 'el agua', 'Bebo agua.', "l'eau", "Je bois de l'eau."],
  ['bread', 'A1', 'food', 'noun', 'bread', 'The bread is fresh.', 'el pan', 'El pan está fresco.', 'le pain', 'Le pain est frais.'],
  ['apple', 'A1', 'food', 'noun', 'apple', 'I eat an apple.', 'la manzana', 'Como una manzana.', 'la pomme', 'Je mange une pomme.'],
  ['cheese', 'A1', 'food', 'noun', 'cheese', 'I love cheese.', 'el queso', 'Me encanta el queso.', 'le fromage', "J'adore le fromage."],
  ['coffee', 'A1', 'food', 'noun', 'coffee', 'The coffee is hot.', 'el café', 'El café está caliente.', 'le café', 'Le café est chaud.'],
  ['milk', 'A1', 'food', 'noun', 'milk', 'The milk is cold.', 'la leche', 'La leche está fría.', 'le lait', 'Le lait est froid.'],
  ['egg', 'A1', 'food', 'noun', 'egg', 'I want two eggs.', 'el huevo', 'Quiero dos huevos.', "l'œuf", 'Je veux deux œufs.'],
  // A1 · home
  ['house', 'A1', 'home', 'noun', 'house', 'The house is big.', 'la casa', 'La casa es grande.', 'la maison', 'La maison est grande.'],
  ['door', 'A1', 'home', 'noun', 'door', 'Close the door, please.', 'la puerta', 'Cierra la puerta, por favor.', 'la porte', "Ferme la porte, s'il te plaît."],
  ['window', 'A1', 'home', 'noun', 'window', 'Open the window.', 'la ventana', 'Abre la ventana.', 'la fenêtre', 'Ouvre la fenêtre.'],
  ['bed', 'A1', 'home', 'noun', 'bed', 'The bed is comfortable.', 'la cama', 'La cama es cómoda.', 'le lit', 'Le lit est confortable.'],
  ['table', 'A1', 'home', 'noun', 'table', 'The keys are on the table.', 'la mesa', 'Las llaves están en la mesa.', 'la table', 'Les clés sont sur la table.'],
  ['kitchen', 'A1', 'home', 'noun', 'kitchen', 'We eat in the kitchen.', 'la cocina', 'Comemos en la cocina.', 'la cuisine', 'Nous mangeons dans la cuisine.'],
  // A1 · time
  ['day', 'A1', 'time', 'noun', 'day', 'One day, I will visit Japan.', 'el día', 'Un día, voy a visitar Japón.', 'le jour', 'Un jour, je vais visiter le Japon.'],
  ['week', 'A1', 'time', 'noun', 'week', 'I work five days a week.', 'la semana', 'Trabajo cinco días a la semana.', 'la semaine', 'Je travaille cinq jours par semaine.'],
  ['today', 'A1', 'time', 'adv', 'today', 'Today is Monday.', 'hoy', 'Hoy es lunes.', "aujourd'hui", "Aujourd'hui, c'est lundi."],
  ['tomorrow', 'A1', 'time', 'adv', 'tomorrow', 'See you tomorrow.', 'mañana', 'Nos vemos mañana.', 'demain', 'On se voit demain.'],
  ['morning', 'A1', 'time', 'noun', 'morning', 'I run every morning.', 'la mañana', 'Corro todas las mañanas.', 'le matin', 'Je cours tous les matins.'],
  ['night', 'A1', 'time', 'noun', 'night', 'The night is quiet.', 'la noche', 'La noche está tranquila.', 'la nuit', 'La nuit est calme.'],
  // A1 · actions
  ['eat', 'A1', 'actions', 'verb', 'to eat', 'We eat at noon.', 'comer', 'Comemos al mediodía.', 'manger', 'Nous mangeons à midi.'],
  ['drink', 'A1', 'actions', 'verb', 'to drink', 'She drinks tea.', 'beber', 'Ella bebe té.', 'boire', 'Elle boit du thé.'],
  ['sleep', 'A1', 'actions', 'verb', 'to sleep', 'The baby sleeps a lot.', 'dormir', 'El bebé duerme mucho.', 'dormir', 'Le bébé dort beaucoup.'],
  ['speak', 'A1', 'actions', 'verb', 'to speak', 'I speak a little French.', 'hablar', 'Hablo un poco de francés.', 'parler', 'Je parle un peu français.'],
  ['go', 'A1', 'actions', 'verb', 'to go', 'We go to the beach.', 'ir', 'Vamos a la playa.', 'aller', 'Nous allons à la plage.'],
  ['want', 'A1', 'actions', 'verb', 'to want', 'I want a coffee.', 'querer', 'Quiero un café.', 'vouloir', 'Je veux un café.'],
  ['read', 'A1', 'actions', 'verb', 'to read', 'I read every night.', 'leer', 'Leo todas las noches.', 'lire', 'Je lis tous les soirs.'],
  // A1 · nature
  ['dog', 'A1', 'nature', 'noun', 'dog', 'The dog is sleeping.', 'el perro', 'El perro está durmiendo.', 'le chien', 'Le chien dort.'],
  ['cat', 'A1', 'nature', 'noun', 'cat', 'The cat is black.', 'el gato', 'El gato es negro.', 'le chat', 'Le chat est noir.'],
  ['sun', 'A1', 'nature', 'noun', 'sun', 'The sun is shining.', 'el sol', 'El sol brilla.', 'le soleil', 'Le soleil brille.'],
  ['rain', 'A1', 'nature', 'noun', 'rain', 'I like the sound of rain.', 'la lluvia', 'Me gusta el sonido de la lluvia.', 'la pluie', "J'aime le bruit de la pluie."],
  ['tree', 'A1', 'nature', 'noun', 'tree', 'There is a tree in the garden.', 'el árbol', 'Hay un árbol en el jardín.', "l'arbre", 'Il y a un arbre dans le jardin.'],
  // A1 · feelings
  ['happy', 'A1', 'feelings', 'adj', 'happy', 'I am very happy.', 'feliz', 'Estoy muy feliz.', 'heureux', 'Je suis très heureux.'],
  ['tired', 'A1', 'feelings', 'adj', 'tired', 'I am tired after work.', 'cansado', 'Estoy cansado después del trabajo.', 'fatigué', 'Je suis fatigué après le travail.'],
  ['big', 'A1', 'feelings', 'adj', 'big', 'It is a big city.', 'grande', 'Es una ciudad grande.', 'grand', "C'est une grande ville."],
  ['small', 'A1', 'feelings', 'adj', 'small', 'I have a small car.', 'pequeño', 'Tengo un coche pequeño.', 'petit', "J'ai une petite voiture."],
  ['good', 'A1', 'feelings', 'adj', 'good', 'This soup is good.', 'bueno', 'Esta sopa está buena.', 'bon', 'Cette soupe est bonne.'],
  // A1 · travel
  ['car', 'A1', 'travel', 'noun', 'car', 'My car is red.', 'el coche', 'Mi coche es rojo.', 'la voiture', 'Ma voiture est rouge.'],
  ['train', 'A1', 'travel', 'noun', 'train', 'The train leaves at eight.', 'el tren', 'El tren sale a las ocho.', 'le train', 'Le train part à huit heures.'],
  ['street', 'A1', 'travel', 'noun', 'street', 'The street is very long.', 'la calle', 'La calle es muy larga.', 'la rue', 'La rue est très longue.'],
  ['city', 'A1', 'travel', 'noun', 'city', 'I live in a big city.', 'la ciudad', 'Vivo en una ciudad grande.', 'la ville', "J'habite dans une grande ville."],
  // A1 · work
  ['work', 'A1', 'work', 'noun', 'work', 'I go to work by bus.', 'el trabajo', 'Voy al trabajo en autobús.', 'le travail', 'Je vais au travail en bus.'],
  ['money', 'A1', 'work', 'noun', 'money', "I don't have much money.", 'el dinero', 'No tengo mucho dinero.', "l'argent", "Je n'ai pas beaucoup d'argent."],
  ['book', 'A1', 'work', 'noun', 'book', 'This book is interesting.', 'el libro', 'Este libro es interesante.', 'le livre', 'Ce livre est intéressant.'],

  // A2 · travel
  ['ticket', 'A2', 'travel', 'noun', 'ticket', 'I bought two tickets.', 'el billete', 'Compré dos billetes.', 'le billet', "J'ai acheté deux billets."],
  ['airport', 'A2', 'travel', 'noun', 'airport', 'The airport is far from here.', 'el aeropuerto', 'El aeropuerto está lejos de aquí.', "l'aéroport", "L'aéroport est loin d'ici."],
  ['suitcase', 'A2', 'travel', 'noun', 'suitcase', 'My suitcase is too heavy.', 'la maleta', 'Mi maleta pesa demasiado.', 'la valise', 'Ma valise est trop lourde.'],
  ['map', 'A2', 'travel', 'noun', 'map', 'Do you have a map of the city?', 'el mapa', '¿Tienes un mapa de la ciudad?', 'la carte', 'Tu as une carte de la ville ?'],
  ['room', 'A2', 'travel', 'noun', 'room', 'The room has a view of the sea.', 'la habitación', 'La habitación tiene vista al mar.', 'la chambre', 'La chambre a vue sur la mer.'],
  ['beach', 'A2', 'travel', 'noun', 'beach', 'We spent the day at the beach.', 'la playa', 'Pasamos el día en la playa.', 'la plage', 'Nous avons passé la journée à la plage.'],
  // A2 · work
  ['meeting', 'A2', 'work', 'noun', 'meeting', 'The meeting starts at ten.', 'la reunión', 'La reunión empieza a las diez.', 'la réunion', 'La réunion commence à dix heures.'],
  ['boss', 'A2', 'work', 'noun', 'boss', 'My boss is on vacation.', 'el jefe', 'Mi jefe está de vacaciones.', 'le patron', 'Mon patron est en vacances.'],
  ['salary', 'A2', 'work', 'noun', 'salary', 'She asked for a higher salary.', 'el sueldo', 'Pidió un sueldo más alto.', 'le salaire', 'Elle a demandé un salaire plus élevé.'],
  ['office', 'A2', 'work', 'noun', 'office', 'The office is on the third floor.', 'la oficina', 'La oficina está en el tercer piso.', 'le bureau', 'Le bureau est au troisième étage.'],
  ['colleague', 'A2', 'work', 'noun', 'colleague', 'My colleague helps me a lot.', 'el compañero de trabajo', 'Mi compañero de trabajo me ayuda mucho.', 'le collègue', "Mon collègue m'aide beaucoup."],
  // A2 · food
  ['vegetable', 'A2', 'food', 'noun', 'vegetable', 'Eat more vegetables.', 'la verdura', 'Come más verduras.', 'le légume', 'Mange plus de légumes.'],
  ['meat', 'A2', 'food', 'noun', 'meat', "I don't eat meat.", 'la carne', 'No como carne.', 'la viande', 'Je ne mange pas de viande.'],
  ['bill', 'A2', 'food', 'noun', 'bill', 'Can we have the bill, please?', 'la cuenta', '¿Nos trae la cuenta, por favor?', "l'addition", "L'addition, s'il vous plaît."],
  ['breakfast', 'A2', 'food', 'noun', 'breakfast', 'Breakfast is ready.', 'el desayuno', 'El desayuno está listo.', 'le petit-déjeuner', 'Le petit-déjeuner est prêt.'],
  // A2 · home
  ['neighbor', 'A2', 'home', 'noun', 'neighbor', 'Our neighbor has three dogs.', 'el vecino', 'Nuestro vecino tiene tres perros.', 'le voisin', 'Notre voisin a trois chiens.'],
  ['key', 'A2', 'home', 'noun', 'key', 'I lost my keys.', 'la llave', 'Perdí mis llaves.', 'la clé', "J'ai perdu mes clés."],
  ['rent', 'A2', 'home', 'noun', 'rent', 'The rent is very expensive.', 'el alquiler', 'El alquiler es muy caro.', 'le loyer', 'Le loyer est très cher.'],
  // A2 · people
  ['husband', 'A2', 'people', 'noun', 'husband', 'Her husband is a teacher.', 'el esposo', 'Su esposo es profesor.', 'le mari', 'Son mari est professeur.'],
  ['wife', 'A2', 'people', 'noun', 'wife', 'His wife works in a hospital.', 'la esposa', 'Su esposa trabaja en un hospital.', 'la femme', 'Sa femme travaille dans un hôpital.'],
  // A2 · time
  ['yesterday', 'A2', 'time', 'adv', 'yesterday', 'I saw her yesterday.', 'ayer', 'La vi ayer.', 'hier', "Je l'ai vue hier."],
  ['always', 'A2', 'time', 'adv', 'always', 'He is always late.', 'siempre', 'Siempre llega tarde.', 'toujours', 'Il est toujours en retard.'],
  ['never', 'A2', 'time', 'adv', 'never', 'I never drink coffee at night.', 'nunca', 'Nunca tomo café por la noche.', 'jamais', 'Je ne bois jamais de café le soir.'],
  ['soon', 'A2', 'time', 'adv', 'soon', 'See you soon.', 'pronto', 'Hasta pronto.', 'bientôt', 'À bientôt.'],
  ['weekend', 'A2', 'time', 'noun', 'weekend', 'What are you doing this weekend?', 'el fin de semana', '¿Qué haces este fin de semana?', 'le week-end', "Qu'est-ce que tu fais ce week-end ?"],
  // A2 · nature
  ['mountain', 'A2', 'nature', 'noun', 'mountain', 'We climbed the mountain.', 'la montaña', 'Subimos la montaña.', 'la montagne', 'Nous avons gravi la montagne.'],
  ['river', 'A2', 'nature', 'noun', 'river', 'The river crosses the city.', 'el río', 'El río cruza la ciudad.', 'la rivière', 'La rivière traverse la ville.'],
  ['weather', 'A2', 'nature', 'noun', 'weather', 'The weather is nice today.', 'el tiempo', 'Hoy hace buen tiempo.', 'le temps', "Il fait beau temps aujourd'hui."],
  ['bird', 'A2', 'nature', 'noun', 'bird', 'A bird is singing.', 'el pájaro', 'Un pájaro está cantando.', "l'oiseau", 'Un oiseau chante.'],
  // A2 · feelings
  ['angry', 'A2', 'feelings', 'adj', 'angry', 'Why are you angry?', 'enfadado', '¿Por qué estás enfadado?', 'en colère', 'Pourquoi es-tu en colère ?'],
  ['sad', 'A2', 'feelings', 'adj', 'sad', 'This movie is very sad.', 'triste', 'Esta película es muy triste.', 'triste', 'Ce film est très triste.'],
  ['nervous', 'A2', 'feelings', 'adj', 'nervous', 'I am nervous before the exam.', 'nervioso', 'Estoy nervioso antes del examen.', 'nerveux', "Je suis nerveux avant l'examen."],
  ['busy', 'A2', 'feelings', 'adj', 'busy', 'I am very busy this week.', 'ocupado', 'Estoy muy ocupado esta semana.', 'occupé', 'Je suis très occupé cette semaine.'],
  // A2 · actions
  ['buy', 'A2', 'actions', 'verb', 'to buy', 'I need to buy milk.', 'comprar', 'Necesito comprar leche.', 'acheter', 'Je dois acheter du lait.'],
  ['forget', 'A2', 'actions', 'verb', 'to forget', "Don't forget your keys.", 'olvidar', 'No olvides tus llaves.', 'oublier', "N'oublie pas tes clés."],
  ['wait', 'A2', 'actions', 'verb', 'to wait', 'Wait for me here.', 'esperar', 'Espérame aquí.', 'attendre', 'Attends-moi ici.'],
  ['learn', 'A2', 'actions', 'verb', 'to learn', 'I want to learn French.', 'aprender', 'Quiero aprender francés.', 'apprendre', 'Je veux apprendre le français.'],
  ['help', 'A2', 'actions', 'verb', 'to help', 'Can you help me?', 'ayudar', '¿Puedes ayudarme?', 'aider', "Tu peux m'aider ?"],
  ['understand', 'A2', 'actions', 'verb', 'to understand', "I don't understand the question.", 'entender', 'No entiendo la pregunta.', 'comprendre', 'Je ne comprends pas la question.'],
  // A2 · basics
  ['maybe', 'A2', 'basics', 'adv', 'maybe', 'Maybe it will rain tomorrow.', 'quizás', 'Quizás llueva mañana.', 'peut-être', 'Il va peut-être pleuvoir demain.'],
  ['enough', 'A2', 'basics', 'adv', 'enough', 'We have enough time.', 'suficiente', 'Tenemos suficiente tiempo.', 'assez', 'Nous avons assez de temps.'],

  // B1 · work
  ['skill', 'B1', 'work', 'noun', 'skill', 'Communication is a key skill.', 'la habilidad', 'La comunicación es una habilidad clave.', 'la compétence', 'La communication est une compétence clé.'],
  ['deadline', 'B1', 'work', 'noun', 'deadline', 'The deadline is next Friday.', 'la fecha límite', 'La fecha límite es el próximo viernes.', 'la date limite', 'La date limite est vendredi prochain.'],
  ['goal', 'B1', 'work', 'noun', 'goal', 'My goal is to speak fluently.', 'el objetivo', 'Mi objetivo es hablar con fluidez.', "l'objectif", 'Mon objectif est de parler couramment.'],
  ['hire', 'B1', 'work', 'verb', 'to hire', 'The company is hiring engineers.', 'contratar', 'La empresa está contratando ingenieros.', 'embaucher', "L'entreprise embauche des ingénieurs."],
  ['achieve', 'B1', 'work', 'verb', 'to achieve', 'She achieved all her goals.', 'lograr', 'Logró todos sus objetivos.', 'atteindre', 'Elle a atteint tous ses objectifs.'],
  // B1 · feelings
  ['proud', 'B1', 'feelings', 'adj', 'proud', 'I am proud of you.', 'orgulloso', 'Estoy orgulloso de ti.', 'fier', 'Je suis fier de toi.'],
  ['grateful', 'B1', 'feelings', 'adj', 'grateful', 'I am grateful for your support.', 'agradecido', 'Estoy agradecido por tu apoyo.', 'reconnaissant', 'Je suis reconnaissant pour ton soutien.'],
  ['disappointed', 'B1', 'feelings', 'adj', 'disappointed', 'He was disappointed by the result.', 'decepcionado', 'Estaba decepcionado con el resultado.', 'déçu', 'Il était déçu du résultat.'],
  ['worried', 'B1', 'feelings', 'adj', 'worried', 'My parents are worried about me.', 'preocupado', 'Mis padres están preocupados por mí.', 'inquiet', 'Mes parents sont inquiets pour moi.'],
  // B1 · actions
  ['improve', 'B1', 'actions', 'verb', 'to improve', 'I want to improve my vocabulary.', 'mejorar', 'Quiero mejorar mi vocabulario.', 'améliorer', 'Je veux améliorer mon vocabulaire.'],
  ['suggest', 'B1', 'actions', 'verb', 'to suggest', 'I suggest we leave early.', 'sugerir', 'Sugiero que salgamos temprano.', 'suggérer', "Je suggère qu'on parte tôt."],
  ['avoid', 'B1', 'actions', 'verb', 'to avoid', 'Try to avoid sugar.', 'evitar', 'Intenta evitar el azúcar.', 'éviter', "Essaie d'éviter le sucre."],
  ['complain', 'B1', 'actions', 'verb', 'to complain', 'He always complains about the weather.', 'quejarse', 'Siempre se queja del tiempo.', 'se plaindre', 'Il se plaint toujours du temps.'],
  ['borrow', 'B1', 'actions', 'verb', 'to borrow', 'Can I borrow your pen?', 'pedir prestado', '¿Puedo pedirte prestado el bolígrafo?', 'emprunter', 'Je peux emprunter ton stylo ?'],
  // B1 · nature
  ['environment', 'B1', 'nature', 'noun', 'environment', 'We must protect the environment.', 'el medio ambiente', 'Debemos proteger el medio ambiente.', "l'environnement", "Nous devons protéger l'environnement."],
  ['pollution', 'B1', 'nature', 'noun', 'pollution', 'Pollution is a serious problem.', 'la contaminación', 'La contaminación es un problema grave.', 'la pollution', 'La pollution est un problème grave.'],
  ['landscape', 'B1', 'nature', 'noun', 'landscape', 'The landscape is breathtaking.', 'el paisaje', 'El paisaje es impresionante.', 'le paysage', 'Le paysage est magnifique.'],
  // B1 · travel
  ['journey', 'B1', 'travel', 'noun', 'journey', 'The journey took twelve hours.', 'el viaje', 'El viaje duró doce horas.', 'le voyage', 'Le voyage a duré douze heures.'],
  ['abroad', 'B1', 'travel', 'adv', 'abroad', 'She studied abroad for a year.', 'en el extranjero', 'Estudió en el extranjero durante un año.', "à l'étranger", "Elle a étudié à l'étranger pendant un an."],
  ['reservation', 'B1', 'travel', 'noun', 'reservation', 'I have a reservation for two.', 'la reserva', 'Tengo una reserva para dos.', 'la réservation', "J'ai une réservation pour deux."],
  ['delay', 'B1', 'travel', 'noun', 'delay', 'There is a two-hour delay.', 'el retraso', 'Hay un retraso de dos horas.', 'le retard', 'Il y a un retard de deux heures.'],
  // B1 · people
  ['relationship', 'B1', 'people', 'noun', 'relationship', 'They have a good relationship.', 'la relación', 'Tienen una buena relación.', 'la relation', 'Ils ont une bonne relation.'],
  ['advice', 'B1', 'people', 'noun', 'advice', 'Thanks for the advice.', 'el consejo', 'Gracias por el consejo.', 'le conseil', 'Merci pour le conseil.'],
  ['trust', 'B1', 'people', 'noun', 'trust', 'Trust takes time to build.', 'la confianza', 'La confianza tarda en construirse.', 'la confiance', 'La confiance prend du temps à se construire.'],
  // B1 · home
  ['furniture', 'B1', 'home', 'noun', 'furniture', 'We bought new furniture.', 'los muebles', 'Compramos muebles nuevos.', 'les meubles', 'Nous avons acheté de nouveaux meubles.'],
  ['move_house', 'B1', 'home', 'verb', 'to move (house)', 'We are moving next month.', 'mudarse', 'Nos mudamos el mes que viene.', 'déménager', 'Nous déménageons le mois prochain.'],
  // B1 · time
  ['meanwhile', 'B1', 'time', 'adv', 'meanwhile', "Meanwhile, I'll make dinner.", 'mientras tanto', 'Mientras tanto, preparo la cena.', 'pendant ce temps', 'Pendant ce temps, je prépare le dîner.'],
  ['nowadays', 'B1', 'time', 'adv', 'nowadays', 'Nowadays, everyone has a phone.', 'hoy en día', 'Hoy en día, todo el mundo tiene teléfono.', 'de nos jours', 'De nos jours, tout le monde a un téléphone.'],
  ['recently', 'B1', 'time', 'adv', 'recently', 'I have recently started running.', 'recientemente', 'Recientemente empecé a correr.', 'récemment', "J'ai récemment commencé à courir."],
  // B1 · food
  ['ingredient', 'B1', 'food', 'noun', 'ingredient', 'This recipe has five ingredients.', 'el ingrediente', 'Esta receta tiene cinco ingredientes.', "l'ingrédient", 'Cette recette a cinq ingrédients.'],
  ['recipe', 'B1', 'food', 'noun', 'recipe', 'Can you share the recipe?', 'la receta', '¿Me pasas la receta?', 'la recette', 'Tu peux me donner la recette ?'],
  ['tasty', 'B1', 'food', 'adj', 'tasty', 'The food here is really tasty.', 'sabroso', 'La comida aquí es muy sabrosa.', 'savoureux', 'La nourriture ici est vraiment savoureuse.'],
  // B1 · basics
  ['however', 'B1', 'basics', 'adv', 'however', "It's expensive; however, it's worth it.", 'sin embargo', 'Es caro; sin embargo, vale la pena.', 'cependant', "C'est cher ; cependant, ça vaut la peine."],
  ['although', 'B1', 'basics', 'phrase', 'although', 'Although it rained, we went out.', 'aunque', 'Aunque llovió, salimos.', 'bien que', "Bien qu'il ait plu, nous sommes sortis."],
];

export const CONCEPTS: Concept[] = ROWS.map(
  ([id, level, topic, pos, en, enEx, es, esEx, fr, frEx]) => ({
    id,
    level,
    topic,
    pos,
    terms: {
      en: { word: en, example: enEx },
      es: { word: es, example: esEx },
      fr: { word: fr, example: frEx },
    },
  }),
);
