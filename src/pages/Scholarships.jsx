import { useState } from 'react';
import OpportunityCard from '../components/OpportunityCard';
import { opportunities } from '../data/opportunities';

const Scholarships = () => {
  const scholarships = opportunities.filter(opp => opp.type === 'scholarship');
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Scholarships</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {scholarships.map(opportunity => (
          <OpportunityCard key={opportunity.id} opportunity={opportunity} />
        ))}
      </div>
    </div>
  );
};

export default Scholarships;