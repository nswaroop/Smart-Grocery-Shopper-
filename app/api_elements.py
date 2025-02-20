#time related factors
avg_isle_transition_time={'Target':30, 'Walmart':45, 'Aldi':20}
checkout_time_per_item={'Target':15, 'Walmart':10, 'Aldi':5}
payment_time={'Target':60, 'Walmart':90, 'Aldi':30}
delivery_time_factors={'Target':4, 'Walmart':4, 'Aldi':3}

#cost related factors
pickup_cost_factors={'Target':1.05, 'Walmart':1.02, 'Aldi':1.0}
delivery_cost_factors={'Target':1.25, 'Walmart':1.1, 'Aldi':1.2}
mileage_per_gallon = 10
gallon_cost = 4

#address
customer_address = "700 Health Sciences Drive, Stony Brook, NY 11794"
store_addresses={'Target':"255 Pond Path, South Setauket, NY 11720", 'Walmart':"161 Centereach Mall, Centereach, NY 11720", 'Aldi':"139 Alexander Ave, Lake Grove, NY 11755"}

import pandas as pd
import numpy as np
import random
import re
import time
from tabulate import tabulate
import googlemaps

master_data=pd.read_csv('unordered_data.csv')
master_data['Product_Name']=master_data['Product_Name'].str.replace(' ','_')
target_data=master_data[master_data['Store']=='Target']
aldi_data=master_data[master_data['Store']=='Aldi']
walmart_data=master_data[master_data['Store']=='Walmart']
common_data=target_data[['Product_Category','Product_Name']]

store_list = ['Target', 'Aldi', 'Walmart']
modes = ['_store','_pickup','_delivery']
unique_categories = list(common_data['Product_Category'].unique())
products_list = list(common_data['Product_Name'].values)
gmaps = googlemaps.Client(key='AIzaSyDYIKLlTL18UhBQ_V5w-5A03O-yCD39K_E')

def generate_cart_price_costs(cart_list):
    prices={}
    carts={}
    for store in store_list:
      for item,quantity in cart_list.items():
        cost_of_item=master_data[(master_data['Store']==store) & (master_data['Product_Name']==item)]['Discount_Price'].iloc[0]
        carts[store] = carts.get(store,[])
        carts[store].append({'name': item, 'price':cost_of_item, 'quantity':quantity})
        prices[store] = prices.get(store, 0) + (cost_of_item * quantity)
    return prices, carts

def mode_of_purchase_calc(individual_cart_prices, distance_travel_costs):
    all_modes_stores={}
    for store in store_list:
      all_modes_stores[store+"_store"] = individual_cart_prices[store] + distance_travel_costs[store]
      all_modes_stores[store+"_pickup"] = round(individual_cart_prices[store] * pickup_cost_factors[store], 2) + distance_travel_costs[store]
      all_modes_stores[store+"_delivery"] = round(individual_cart_prices[store] * delivery_cost_factors[store], 2)
    return all_modes_stores

def get_distance_time():
    c_location = gmaps.geocode(customer_address)[0]['geometry']['location']
    c_lat_lng = (c_location['lat'], c_location['lng'])
    distance_time_data={}
    for store in store_list:
        location = gmaps.geocode(store_addresses[store])[0]['geometry']['location']
        lat_lng = (location['lat'], location['lng'])
        result = gmaps.distance_matrix(c_lat_lng, lat_lng, mode='driving')
        distance = result['rows'][0]['elements'][0]['distance']['text']
        duration = result['rows'][0]['elements'][0]['duration']['text']
        minutes_match = re.search(r'(\d+)\s*mins?', duration)
        minutes = int(minutes_match.group(1))
        kms_match = numeric_value = re.search(r'\d+', distance).group()
        kms = int(kms_match)
        kms_cost=(kms/mileage_per_gallon)*gallon_cost
        distance_time_data[store]={'distance':kms_cost*2, 'duration':minutes*60}
    return distance_time_data

def time_calc(cart_items):
    unique_isles=[]
    store_times={}
    for item in cart_items:
       unique_isles.append(common_data[common_data['Product_Name']==item]['Product_Category'].iloc[0])
    isle_travel_count=len(set(unique_isles))+2
    cart_quantity=sum(list(cart_items.values()))
    for store in store_list:
        total_isle_travel_time = isle_travel_count * avg_isle_transition_time[store]
        total_checkout_time = ( checkout_time_per_item[store] * cart_quantity ) + payment_time[store]
        total_time = total_isle_travel_time + total_checkout_time
        store_times[store]= total_time
    return store_times

def all_times_calc(store_times,store_travel_times):
    all_times_stores={}
    service_store_split={}
    for store in store_list:
      all_times_stores[store+"_store"] = store_times[store] + store_travel_times[store] + store_travel_times[store]
      service_store_split[store+"_store"] = {'store_time':store_times[store], 'service_time':2*store_travel_times[store]}
      all_times_stores[store+"_pickup"] = max (store_times[store], store_travel_times[store]) + store_travel_times[store]
      service_store_split[store+"_pickup"] = {'store_time':0, 'service_time':all_times_stores[store+"_pickup"]}
      all_times_stores[store+"_delivery"] = (store_times[store] + store_travel_times[store]) * delivery_time_factors[store]
      service_store_split[store+"_delivery"] = {'store_time':0, 'service_time':all_times_stores[store+"_delivery"]}
    return all_times_stores, service_store_split

def z_score(values):
    mean = np.mean(list(values.values()))
    std_dev = np.std(list(values.values()))
    z_scores = [round((t - mean) / std_dev,2) for t in list(values.values())]
    return z_scores
def min_max(values):
    min_val = min(values)
    max_val = max(values)
    scaled_values = [round(((x - min_val) / (max_val - min_val)), 2) for x in values]
    return scaled_values
def normalize(times,costs):
    return min_max(z_score(times)), min_max(z_score(costs))

def unite_standardized_list(scaled_costs, scaled_times):
    result_dict = {}
    prefix_index=0
    for i,(time,cost) in enumerate(zip(scaled_times,scaled_costs)):
        suffix = modes[i % 3]
        prefix=store_list[prefix_index]
        if i % 3 == 2:
          prefix_index+=1
        key = f"{prefix}{suffix}"
        result_dict[key] = {'time': time, 'cost':cost}
    return result_dict

def apply_priority(dictionary, time_priority, cost_priority):
    for key, value in dictionary.items():
        if isinstance(value, dict):
            apply_priority(value, time_priority, cost_priority)
        else:
            if key == 'time':
                dictionary[key] = round(value * time_priority,2)
            elif key == 'cost':
                dictionary[key] = round(value * cost_priority,2)
    return dictionary

def combine_sum_time(dictionary):
    result_dictionary={}
    for key,value in dictionary.items():
        result_dictionary[key]=round(sum(value.values()),2)
    return result_dictionary

def mix_generate(dictionary, costs, times, stores_list=["None"], modes_list=["None"]):
  data=[]
  dict_keys=[key for key in dictionary.keys()]
  used_keys = [key for key in dict_keys if any(key.startswith(prefix) for prefix in stores_list) or any(key.endswith(suffix) for suffix in modes_list)][:2]
  print('Used keys', used_keys)
  unused_keys = [key for key in dict_keys if key not in used_keys][:1]
  for key in used_keys + unused_keys:
      minutes, seconds = divmod(times[key], 60)
      data.append([key, costs[key], f"Approx {int(minutes)+1} min"])
  return data

def generate_data(combined, costs, times, stores_list=None, modes_list=None):

    combined_keys = list(combined.keys())
    data=[]

    if not stores_list and not modes_list:
        keys = combined_keys[:3]
        for key in keys:
            minutes, seconds = divmod(times[key], 60)
            data.append([key, costs[key], f"Approx {int(minutes)} min {int(seconds)} sec"])

    elif stores_list and not modes_list:
        data = mix_generate(combined, costs, times, stores_list, ["None"])

    elif modes_list and not stores_list:
        data = mix_generate(combined, costs, times, ["None"], modes_list)

    elif stores_list and modes_list:
        data = mix_generate(combined, costs, times, stores_list, modes_list)

    return data