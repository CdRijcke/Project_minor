
import csv
import json

# def name_converter(number_city):
#     if int(number_city) == 269:
#         return "Lelystad"
#     elif int(number_city) == 270:
#         return "Leeuwarden"

def check_fill(number_value, month_variable):
    if not number_value.isspace():
        return number_value
    else:
        return (month_variable/counter)

# converts the KNMI_data.csv file to  the KNMI_info.json file
temp_store = {}

with open('BMI_obesity.csv', 'r') as csvfile:
    barchart_csv = csv.reader(csvfile)
    types = barchart_csv.next()
    # print types
    # years = barchart_csv.next()
    # print years
    # first = barchart_csv.next()
    # print first
    # first = barchart_csv.next()
    # print first
    # first = barchart_csv.next()
    # print first
    # print years[3] # year
    # print years[1] # country_code
    # print years[0] # country_name
    # print years[2] # sex
    # print years[4] # mean BMI
    # print years[7] # mean overweight
    # print years[10] #  mean obesity
    # print "\n\n",types, "\n"

    # temp_store = {years[3]:{years[2]:"super obese"}}


    for line in barchart_csv:
        if line[3] in temp_store.keys():
            if line[2] in temp_store[line[3]].keys():
                temp_store[line[3]][line[2]].append({"mean_bmi":line[4], "country_code": line[1], "country_name": line[0], "fraction_overweight": line[7], "fraction_obese":line[10]})
                # hoi = {"mean_bmi":line[4], "country_code": line[1], "country_name": line[0], "fraction_overweight": line[7], "fraction_obese":line[10]}
            else:
                temp_store[line[3]][line[2]] = [{"mean_bmi":line[4], "country_code": line[1],"country_name": line[0], "fraction_overweight": line[7], "fraction_obese":line[10]}]
        else:
            temp_store[line[3]] = {line[2]:[{"mean_bmi":line[4], "country_code": line[1],"country_name": line[0], "fraction_overweight": line[7], "fraction_obese":line[10]}]}

    # print temp_store, "\n"
    temp_store["1992"]["Men"][0]["Hey"] = "whats wrong with you"
#    print temp_store["1992"]["Men"][0]
    first = True

csvfile.close()


with open('physical_acitivity.csv', 'r') as phys_csvfile:
    phys_csv = csv.reader(phys_csvfile)
    line = phys_csv.next()
    # print line[4] # country_name
    # print line[6] # sex
    # print line[7] # physical_acitivity

    # print line[6] == "Male"

    for line in phys_csv:
        if line[6] == "Male":
            for country in temp_store["2010"]["Men"]:
                if country["country_name"] == line[4]:
                    country["physicial_activity"] = line[7].partition(' ')[0]
        if line[6] == "Female":
            for country in temp_store["2010"]["Women"]:
                if country["country_name"] == line[4]:
                    country["physicial_activity"] = line[7].partition(' ')[0]
phys_csvfile.close()

with open("foodsupply_per_capita.csv", "r") as food_csvfile:
    food_csv = csv.reader(food_csvfile)
    line = food_csv.next()
    # line = food_csv.next()
    # line = food_csv.next()
    # print line[3] # value
    # print line[0] # country_code


    for line in food_csv:
        for country in temp_store["2010"]["Men"]:
            if country["country_code"] == line[0]:
                country["food_supply"] = line[3]

        for country in temp_store["2010"]["Women"]:
            if country["country_code"] == line[0]:
                country["food_supply"] = line[3]
                country["country_code"]
food_csvfile.close()


# print "this one:", temp_store["2010"]["Men"][0]

    # dict1 = {"2016": "hello", "2017":"Beware for the Trump"}
    # dict1 = dict()
    # dict1["2016"] = ["mr Trump"]
    # dict1["2016"].append("O, dear lord")
    # dict1["2016"].append({"hey": "whats wrong with you"})
    # print dict1["2016"][2]["hey"]
year_span = [2005,2006,2007,2008,2009,2010,2011]
with open('obesity_data.json', 'w') as outfile:
    json.dump(temp_store, outfile)
    print "JSON file created"
outfile.close()
