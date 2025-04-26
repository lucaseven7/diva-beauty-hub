// Servizio per gestire il salvataggio dei dati in localStorage

// Chiavi per i dati
const STORAGE_KEYS = {
  CLIENTS: 'diva-beauty-clients',
  APPOINTMENTS: 'diva-beauty-appointments',
  SERVICES: 'diva-beauty-services',
};

// Servizi disponibili
export const beautyServices = [
  {
    id: 'service-1',
    name: 'Manicure classica',
    price: 20,
    duration: 30, // minuti
    category: 'manicure'
  },
  {
    id: 'service-2',
    name: 'Manicure con smalto normale',
    price: 25,
    duration: 40,
    category: 'manicure'
  },
  {
    id: 'service-3',
    name: 'Manicure con smalto semipermanente',
    price: 35,
    duration: 45,
    category: 'manicure'
  },
  {
    id: 'service-4',
    name: 'Ricostruzione unghie in gel',
    price: 50,
    duration: 60,
    category: 'ricostruzione'
  },
  {
    id: 'service-5',
    name: 'Ricostruzione unghie in acrilico',
    price: 55,
    duration: 70,
    category: 'ricostruzione'
  },
  {
    id: 'service-6',
    name: 'Allungamento unghie con cartina o tip',
    price: 45,
    duration: 60,
    category: 'allungamento'
  },
  {
    id: 'service-7',
    name: 'Refill (ritocco ricrescita)',
    price: 35,
    duration: 45,
    category: 'manutenzione'
  },
  {
    id: 'service-8',
    name: 'Copertura unghie naturali in gel o acrilico',
    price: 40,
    duration: 50,
    category: 'copertura'
  },
  {
    id: 'service-9',
    name: 'Nail art semplice (decorazioni base)',
    price: 15,
    duration: 20,
    category: 'nail-art'
  },
  {
    id: 'service-10',
    name: 'Nail art avanzata (effetti 3D, pittura a mano)',
    price: 30,
    duration: 40,
    category: 'nail-art'
  },
  {
    id: 'service-11',
    name: 'Applicazione di strass, stickers, glitter, foil',
    price: 10,
    duration: 15,
    category: 'decorazioni'
  },
  {
    id: 'service-12',
    name: 'French classico o colorato',
    price: 15,
    duration: 20,
    category: 'french'
  },
  {
    id: 'service-13',
    name: 'Babyboomer',
    price: 20,
    duration: 25,
    category: 'effetti'
  },
  {
    id: 'service-14',
    name: 'Rimozione gel/acrilico/semipermanente',
    price: 15,
    duration: 30,
    category: 'rimozione'
  },
  {
    id: 'service-15',
    name: 'Trattamento rinforzante per unghie fragili',
    price: 25,
    duration: 30,
    category: 'trattamenti'
  },
  {
    id: 'service-16',
    name: 'Trattamento cuticole',
    price: 15,
    duration: 20,
    category: 'trattamenti'
  },
  {
    id: 'service-17',
    name: 'Trattamento paraffina mani',
    price: 20,
    duration: 25,
    category: 'trattamenti'
  },
  {
    id: 'service-18',
    name: 'Trattamento idratante mani',
    price: 18,
    duration: 20,
    category: 'trattamenti'
  },
  {
    id: 'service-19',
    name: 'Applicazione unghie press-on',
    price: 30,
    duration: 30,
    category: 'applicazione'
  },
  {
    id: 'service-20',
    name: 'Ricostruzione unghia rotta',
    price: 15,
    duration: 20,
    category: 'riparazione'
  }
];

// Funzione per ottenere tutti i servizi
export const getServices = () => {
  const servicesData = localStorage.getItem(STORAGE_KEYS.SERVICES);
  return servicesData ? beautyServices : beautyServices;
};

// Funzione per salvare i servizi
export const saveServices = (services) => {
  localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
};

// Funzione per inizializzare i servizi se non esistono
export const initializeServices = () => {
  if (!localStorage.getItem(STORAGE_KEYS.SERVICES)) {
    saveServices(beautyServices);
  }
};

// Funzioni per i clienti
export const getClients = () => {
  const clientsData = localStorage.getItem(STORAGE_KEYS.CLIENTS);
  return clientsData ? JSON.parse(clientsData) : [];
};

export const saveClients = (clients) => {
  localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
};

export const addClient = (client) => {
  const clients = getClients();
  // Usa l'ID fornito se esiste, altrimenti ne genera uno nuovo
  const newClient = {
    ...client,
    id: client.id || `client-${Date.now()}`,
    totalVisits: client.totalVisits || 0,
    lastVisit: client.lastVisit || 'Mai',
  };
  clients.push(newClient);
  saveClients(clients);
  return newClient;
};

// Funzione per aggiornare un cliente
export const updateClient = (updatedClient) => {
  const clients = getClients();
  const index = clients.findIndex(client => client.id === updatedClient.id);
  
  if (index !== -1) {
    clients[index] = updatedClient;
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    return updatedClient;
  }
  
  return null;
};

// Funzione per aggiungere una foto a un cliente
export const addClientPhoto = (clientId, photoData) => {
  const clients = getClients();
  const index = clients.findIndex(client => client.id === clientId);
  
  if (index !== -1) {
    const client = clients[index];
    const photos = client.photos || [];
    
    const newPhoto = {
      id: `photo-${Date.now()}`,
      url: photoData,
      date: new Date().toISOString(),
      description: "Foto cliente"
    };
    
    client.photos = [...photos, newPhoto];
    clients[index] = client;
    
    localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    return newPhoto;
  }
  
  return null;
};

export const deleteClient = (clientId) => {
  const clients = getClients();
  const filteredClients = clients.filter(c => c.id !== clientId);
  saveClients(filteredClients);
};

// Funzioni per gli appuntamenti
export const getAppointments = () => {
  const appointmentsData = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
  return appointmentsData ? JSON.parse(appointmentsData) : [];
};

export const saveAppointments = (appointments) => {
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
};

export const addAppointment = (appointment) => {
  const appointments = getAppointments();
  const newAppointment = {
    ...appointment,
    id: appointment.id || `appt-${Date.now()}`,
    status: appointment.status || 'scheduled',
  };
  appointments.push(newAppointment);
  saveAppointments(appointments);
  
  return newAppointment;
};

export const deleteAppointment = (appointmentId) => {
  const appointments = getAppointments();
  const filteredAppointments = appointments.filter(a => a.id !== appointmentId);
  saveAppointments(filteredAppointments);
};

// Funzione per ottenere un singolo cliente
export const getClient = (clientId) => {
  const clients = getClients();
  return clients.find(c => c.id === clientId);
};

// Funzione per ottenere un singolo appuntamento
export const getAppointment = (appointmentId) => {
  const appointments = getAppointments();
  return appointments.find(a => a.id === appointmentId);
};

// Funzione per aggiornare un appuntamento esistente
export const updateAppointment = (updatedAppointment) => {
  const appointments = getAppointments();
  const updatedAppointments = appointments.map(appointment => 
    appointment.id === updatedAppointment.id ? updatedAppointment : appointment
  );
  localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(updatedAppointments));
  return updatedAppointment;
};

// Funzione per aggiornare le statistiche del cliente
export const updateClientStats = (clientId) => {
  const clients = getClients();
  const clientIndex = clients.findIndex(c => c.id === clientId);
  
  if (clientIndex !== -1) {
    // Ottieni tutti gli appuntamenti completati per questo cliente
    const appointments = getAppointments();
    const completedAppointments = appointments.filter(
      appt => appt.clientId === clientId && appt.status === 'completed'
    );
    
    // Aggiorna il cliente con le nuove statistiche
    clients[clientIndex].totalVisits = completedAppointments.length;
    
    // Imposta l'ultima visita alla data dell'ultimo appuntamento completato
    if (completedAppointments.length > 0) {
      // Ordina gli appuntamenti per data (dal più recente)
      const sortedAppointments = [...completedAppointments].sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      // Formatta la data dell'ultimo appuntamento
      const lastDate = new Date(sortedAppointments[0].date);
      clients[clientIndex].lastVisit = lastDate.toLocaleDateString('it-IT');
    }
    
    // Salva le modifiche
    saveClients(clients);
    return true;
  }
  
  return false;
};

// Inizializzazione: carica i dati mock solo se non ci sono dati salvati
export const initializeStorage = (mockClients, mockAppointments) => {
  if (!localStorage.getItem(STORAGE_KEYS.CLIENTS) || getClients().length === 0) {
    saveClients(mockClients);
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.APPOINTMENTS) || getAppointments().length === 0) {
    saveAppointments(mockAppointments);
  }
  
  // Inizializza anche i servizi
  initializeServices();
};

// Funzione per completare un appuntamento
export const completeAppointment = (appointmentId) => {
  const appointments = getAppointments();
  const index = appointments.findIndex(a => a.id === appointmentId);
  
  if (index !== -1) {
    // Aggiorna lo stato dell'appuntamento a 'completed'
    appointments[index].status = 'completed';
    saveAppointments(appointments);
    
    // Aggiorna le statistiche del cliente
    updateClientStats(appointments[index].clientId);
    
    return appointments[index];
  }
  
  return null;
};

// Funzione per aggiungere una foto a un appuntamento
export const addAppointmentPhoto = (appointmentId, imageUrl) => {
  const appointments = getAppointments();
  const index = appointments.findIndex(a => a.id === appointmentId);
  
  if (index !== -1) {
    appointments[index].imageUrl = imageUrl;
    saveAppointments(appointments);
    
    // Aggiorna anche la galleria del cliente
    updateClientGallery(appointments[index].clientId, imageUrl, appointmentId);
    
    return appointments[index];
  }
  
  return null;
};

// Funzione per aggiornare la galleria di un cliente
export const updateClientGallery = (clientId, imageUrl, appointmentId) => {
  const clients = getClients();
  const clientIndex = clients.findIndex(c => c.id === clientId);
  
  if (clientIndex !== -1) {
    // Inizializza l'array gallery se non esiste
    if (!clients[clientIndex].gallery) {
      clients[clientIndex].gallery = [];
    }
    
    // Aggiungi la foto alla galleria del cliente
    clients[clientIndex].gallery.push({
      id: `photo-${Date.now()}`,
      imageUrl: imageUrl,
      appointmentId: appointmentId,
      date: new Date().toISOString()
    });
    
    saveClients(clients);
    return true;
  }
  
  return false;
};

// Funzione per ottenere tutte le foto di un cliente
export const getClientGallery = (clientId) => {
  const client = getClient(clientId);
  return client && client.gallery ? client.gallery : [];
};

// Funzione per ottenere tutte le foto di tutti i clienti (per la galleria generale)
export const getAllPhotos = () => {
  const clients = getClients();
  let allPhotos = [];
  
  clients.forEach(client => {
    if (client.gallery && client.gallery.length > 0) {
      const clientPhotos = client.gallery.map(photo => ({
        ...photo,
        clientName: client.name,
        clientId: client.id
      }));
      allPhotos = [...allPhotos, ...clientPhotos];
    }
  });
  
  // Ordina per data, dal più recente
  return allPhotos.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

// Funzione per ottenere gli appuntamenti imminenti (entro le prossime ore)
export const getUpcomingAppointmentsForNotification = (hoursThreshold = 3) => {
  const appointments = getAppointments();
  const now = new Date();
  const thresholdTime = new Date(now.getTime() + hoursThreshold * 60 * 60 * 1000);
  
  return appointments.filter(appt => {
    if (appt.status !== 'scheduled') return false;
    
    const apptDateTime = new Date(`${appt.date}T${appt.time}`);
    return apptDateTime > now && apptDateTime <= thresholdTime;
  });
};