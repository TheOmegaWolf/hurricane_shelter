import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './Styles/SafetyInfo.module.css';

const SafetyInfo = () => {
  const [expandedTip, setExpandedTip] = useState(null);

  const toggleTip = (index) => {
    setExpandedTip(expandedTip === index ? null : index);
  };

  const safetyTips = [
    {
      title: 'Prepare an Emergency Kit',
      content: 'Include water, non-perishable food, first aid supplies, flashlight, and batteries. Ensure you have enough supplies to last for at least 72 hours.'
    },
    {
      title: 'Create a Family Communication Plan',
      content: 'Decide how to contact each other and where to meet in case of an emergency. Choose an out-of-area contact as a central point of communication.'
    },
    {
      title: 'Stay Informed',
      content: 'Listen to local news or a NOAA Weather Radio for emergency updates. Sign up for emergency alerts in your area.'
    },
    {
      title: 'Know Evacuation Routes',
      content: 'Familiarize yourself with multiple evacuation routes from your home and workplace. Practice these routes with your family.'
    },
  ];

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Safety Tips</h1>
      <div className={styles.tipsList}>
        {safetyTips.map((tip, index) => (
          <div key={index} className={styles.tipCard}>
            <button 
              className={styles.tipButton}
              onClick={() => toggleTip(index)}
            >
              {tip.title}
              {expandedTip === index ? (
                <ChevronUp className={styles.tipIcon} size={20} />
              ) : (
                <ChevronDown className={styles.tipIcon} size={20} />
              )}
            </button>
            {expandedTip === index && (
              <div className={styles.tipContent}>
                {tip.content}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SafetyInfo;