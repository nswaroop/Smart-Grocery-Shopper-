import React, { useState } from 'react';
import './Form.css'; // Replace with the actual path to your CSS file
import Select from 'react-select';

const Form = ({ handleFormChange }) => {
  // State variables for form data
  const [timePriority, setTimePriority] = useState('');
  const [pricePriority, setPricePriority] = useState('');
  const [selectedStores, setSelectedStores] = useState([]);
  const [servicePreferences, setServicePreferences] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Process form data as needed
    console.log('Form submitted:', { timePriority, pricePriority, selectedStores, servicePreferences });
    handleFormChange(timePriority, pricePriority, selectedStores, servicePreferences)
  };
  


const handleSelectChange = (selectedOptions) => {
    setSelectedStores(selectedOptions);
    console.log('store value:', { selectedStores});
  };

  const handleSelectChangeService = (selectedOptions) => {
    setServicePreferences(selectedOptions);
    console.log('service value:', { selectedStores});
  };

  const stores = [
    { value: 'Walmart', label: 'Walmart' },
    { value: 'Target', label: 'Target' },
    { value: 'Aldi', label: 'Aldi' }
  ]
  const services = [
    { value: 'pickup', label: 'Pickup' },
    { value: 'delivery', label: 'Delivery' },
    { value: 'store', label: 'In-Store' }
  ]
  const priorityLabels = {
    0: 'Not a priority',
    1: 'Low priority',
    2: 'Medium priority',
    3: 'High priority',
    4: 'Very High priority',
    5: 'Critical priority',
  };
  return (
    <div className="row">
      <div className="col-md-12">
        <form onSubmit={handleSubmit} className='recform'>
          <h1>Recommendation</h1>

          <fieldset>
            <legend>
              <span className="num">1</span> Time Priority
            </legend>

            {/* Individual radio buttons for Time Priority */}
            {[0,1, 2, 3, 4, 5].map((priority) => (
              <label key={priority}>
                <input
                  type="radio"
                  value={priority}
                  checked={timePriority === `${priority}`}
                  onChange={() => setTimePriority(`${priority}`)}
                />
                {priorityLabels[priority]}
              </label>
            ))}
          </fieldset>

          <fieldset>
            <legend>
              <span className="num">2</span> Price Priority
            </legend>

            {/* Individual radio buttons for Price Priority */}
            {[0,1, 2, 3, 4, 5].map((priority) => (
              <label key={priority}>
                <input
                  type="radio"
                  value={priority}
                  checked={pricePriority === `${priority}`}
                  onChange={() => setPricePriority(`${priority}`)}
                />
                {priorityLabels[priority]}
              </label>
            ))}
          </fieldset>

          <fieldset>
            <legend>
              <span className="num">3</span> Store Selection
            </legend>
            <label>
              Select Stores: 
              <Select
               isMulti
               name="Stores"
               options={stores}
               onChange={handleSelectChange}
              />
            </label>
                        
          </fieldset>

          <fieldset>
            <legend>
              <span className="num">4</span> Service Preferences
            </legend>
            <label>
              Service Preferences:
              {/* <select value={servicePreferences} onChange={(e) => setServicePreferences(e.target.value)}>
                <option value="delivery">Delivery</option>
                <option value="pickup">Pickup</option>
                <option value="inStore">In Store</option>
              </select> */}
              <Select
               isMulti
               name="Services"
               options={services}
               onChange={handleSelectChangeService}
              />
            </label>
          </fieldset>

          <button type="submit" className="butt">Generate</button>
        </form>
      </div>
    </div>
  );
};

export default Form;
