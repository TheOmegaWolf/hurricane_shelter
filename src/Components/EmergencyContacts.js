import React, { useState } from 'react';
import { Phone, Plus, X } from 'lucide-react';
import styles from './Styles/EmergencyContacts.module.css';

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([
    { name: 'Police', number: '911' },
    { name: 'Fire Department', number: '911' },
    { name: 'Ambulance', number: '911' },
    { name: 'Poison Control', number: '1-800-222-1222' },
  ]);
  const [newContact, setNewContact] = useState({ name: '', number: '' });
  const [isAdding, setIsAdding] = useState(false);

  const addContact = () => {
    if (newContact.name && newContact.number) {
      setContacts([...contacts, newContact]);
      setNewContact({ name: '', number: '' });
      setIsAdding(false);
    }
  };

  return (
    <div className={styles.container}>
    <h1 className={styles.title}>Emergency Contacts</h1>
    <div className={styles.contactList}>
      {contacts.map((contact, index) => (
        <div key={index} className={styles.contactCard}>
          <div className={styles.contactInfo}>
            <h3>{contact.name}</h3>
            <p>{contact.number}</p>
          </div>
          <button className={styles.callButton}>
            <Phone size={20} />
          </button>
        </div>
      ))}
    </div>
    
    {!isAdding && (
      <button 
        onClick={() => setIsAdding(true)}
        className={styles.addButton}
      >
        <Plus size={20} className="mr-2" /> Add New Contact
      </button>
    )}

    {isAdding && (
      <div className={styles.addForm}>
        <div className={styles.formHeader}>
          <h3>Add New Contact</h3>
          <button onClick={() => setIsAdding(false)} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>
        <input
          type="text"
          placeholder="Name"
          value={newContact.name}
          onChange={(e) => setNewContact({...newContact, name: e.target.value})}
          className={styles.input}
        />
        <input
          type="tel"
          placeholder="Number"
          value={newContact.number}
          onChange={(e) => setNewContact({...newContact, number: e.target.value})}
          className={styles.input}
        />
        <button 
          onClick={addContact}
          className={styles.submitButton}
        >
          Add Contact
        </button>
      </div>
    )}
  </div>
  );
};

export default EmergencyContacts;