import React, { useEffect, useState } from 'react';

const MotivationQuote = () => {
  const [quote, setQuote] = useState("");

  useEffect(() => {
    // Fetch the quotes from the public directory
    fetch(`${process.env.PUBLIC_URL}/study_motivation_quotes.txt`)
      .then(response => response.text())
      .then(data => {
        const quotesArray = data.split('\n').filter(quote => quote.trim() !== ""); // Split by new lines and filter out empty lines
        
        // Get a random quote index every time the page is refreshed
        const randomQuoteIndex = Math.floor(Math.random() * quotesArray.length); // Random index between 0 and quotesArray.length - 1
        
        // Save the random index to localStorage (optional, in case you want to maintain the index)
        localStorage.setItem('quoteIndex', randomQuoteIndex);

        setQuote(quotesArray[randomQuoteIndex]); // Set the selected random quote
      })
      .catch(error => console.error("Error loading quotes:", error));
  }, []); // Empty dependency array ensures this runs only once on component mount

  return (
    <div className="bg-[#e0f7fa] p-4 rounded-lg mt-4">
      <p className="text-lg text-[#00796b] font-semibold italic">"{quote}"</p>
    </div>
  );
};

export default MotivationQuote;
