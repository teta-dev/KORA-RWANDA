import OpportunityCard from '../components/OpportunityCard';
import { opportunities } from '../data/opportunities';

const Training = () => {
  const trainings = opportunities.filter(opp => opp.type === 'training');
  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Training Programs</h1>
      {trainings.length === 0 ? (
        <p className="text-gray-500">No training programs available at the moment.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trainings.map(opportunity => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Training;