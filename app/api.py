from flask import Flask, request, jsonify
from api_elements import generate_cart_price_costs, mode_of_purchase_calc, get_distance_time, time_calc, all_times_calc, z_score, min_max, normalize, unite_standardized_list, apply_priority, combine_sum_time, mix_generate, generate_data, mileage_per_gallon, gallon_cost
from flask_cors import CORS
app = Flask(__name__)
CORS(app)

@app.route('/communicate_data', methods=['POST'])
def communicate_data():
    data = request.json  # Get data from the request
    # Call your Python functions to process the data
    print("hi from server",data)
    processed_data = modify_data(data)
    # Send the processed data back to React
    return jsonify(processed_data)

def modify_data(json_data):
    #expected data input
    """{
    "cart": [
        {"name": "item1", "quantity": 3},
        {"name": "item2", "quantity": 2},
        # ... other items in the cart
    ],
    "timePriority": 1,
    "costPriority": 2,
    "storePreferences": ["store1", "store2", "store3"],
    "servicePreferences": ["mode1", "mode2", "mode3"]}"""

    cart_dict = {item["name"]: item["quantity"] for item in json_data["cart"]}
    time_priority = int(json_data["timePriority"])
    cost_priority = int(json_data["costPriority"])
    stores_list = [item['value'] for item in json_data["storePreferences"]]
    modes_list = [item['value'] for item in json_data["servicePreferences"]]
    processed_data=process_data(cart_dict, time_priority, cost_priority, stores_list, modes_list)
    return processed_data

def process_data(CART, time_priority, cost_priority, selected_stores, selected_modes):
    print("Estimating travel times....")
    travel=get_distance_time()
    travel_time = {store: data['duration'] for store, data in travel.items()}
    distance_travel_costs = {store: data['distance'] for store, data in travel.items()}

    print("Calculating costs....")
    cart_price, carts=generate_cart_price_costs(CART)
    mode_cost_calc=mode_of_purchase_calc(cart_price, distance_travel_costs)
    # time.sleep(2)

    print("Summarizing buying times....")
    times=time_calc(CART)
    mode_time_calc, services_split=all_times_calc(times,travel_time)
    # time.sleep(2)

    print('Calculating best paths....')
    normalized_times,normalized_costs = normalize(mode_time_calc,mode_cost_calc)
    combined_values = unite_standardized_list(normalized_costs,normalized_times)

    prioritized = apply_priority(combined_values,time_priority, cost_priority)
    sum_cost_time = combine_sum_time(prioritized)
    # time.sleep(2)

    print('Looking for best solutions....')
    combined_sort=dict(sorted(sum_cost_time.items(), key=lambda item: item[1]))

    output_data=generate_data(combined_sort, mode_cost_calc, mode_time_calc, selected_stores, selected_modes)
    """[
    {
      Store:"Walmart",
      Service:"Delivery",
      TotalCost:100,
      CartCost:90,
      ServiceCost:10,
      TotalTime:"1hr 30min",
      Items:[{name:"apple",price:"30"},{name:"orange",price:"40"}],
      Time:["30min","1hr"] //[Storetime,servicetime]
    },{},.....]
""" 
    sending_list=[]
    for triple in output_data:
        Store,Service=triple[0].split('_')
        TotalCost=triple[1]
        CartCost=cart_price[Store]
        ServiceCost=TotalCost-CartCost
        TotalTime=triple[2]
        Items=carts[Store]
        store_time = services_split[triple[0]]['store_time']
        service_time = services_split[triple[0]]['service_time']
        times=[f'{(store_time//60)} min', f'{(service_time//60)+1} min']
        sending_list.append({'Store':Store, 'Service':Service, 'TotalCost':round(TotalCost,2), 'CartCost':round(CartCost,2), 'ServiceCost':round(ServiceCost,2), 'TotalTime':TotalTime,'Items':Items, 'Time':times})

    return sending_list



if __name__ == '__main__':
    app.run(debug=True, port=5001)