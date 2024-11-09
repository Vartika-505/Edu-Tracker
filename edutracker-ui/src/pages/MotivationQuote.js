// src/components/MotivationQuote.js
import React, { useEffect, useState } from 'react';

const MotivationQuote = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Fetch the quotes from the public directory
    fetch(`${process.env.PUBLIC_URL}/study_motivation_quotes.txt`)
      .then(response => response.text())
      .then(data => {
        const quotesArray = data.split('\n').filter(quote => quote.trim() !== ""); // Split by new lines and filter out empty lines

        const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        const storedDate = localStorage.getItem('quoteDate');
        let quoteIndex = parseInt(localStorage.getItem('quoteIndex'), 10) || 0;

        // If the stored date is not today, update the quote index
        if (storedDate !== today) {
          quoteIndex = (quoteIndex + 1) % quotesArray.length; // Move to the next quote
          localStorage.setItem('quoteIndex', quoteIndex);      // Update index in localStorage
          localStorage.setItem('quoteDate', today);            // Update date in localStorage
        }

        setQuote(quotesArray[quoteIndex]); // Set the selected quote
      })
      .catch(error => console.error("Error loading quotes:", error));
  }, []);

  return (
    <div className="bg-[#e0f7fa] p-4 rounded-lg mt-4">
      <p className="text-lg text-[#00796b] font-semibold italic">"{quote}"</p>
    </div>
  );
};

export default MotivationQuote;
