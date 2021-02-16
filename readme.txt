http://adilmoujahid.com/posts/2015/01/interactive-data-visualization-d3-dc-python-mongodb/
Interactive Data Visualization with D3.js, DC.js, Python, and MongoDB 

1. install MongoDB, configure MongoDB for windows
https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/

mongodb tools are separate from mongodb now, install separately 
https://www.mongodb.com/try/download/database-tools?tck=docs_databasetools

Add MongoDB and Tools binaries to the System PATH
https://dangphongvanthanh.wordpress.com/2017/06/12/add-mongos-bin-folder-to-the-path-environment-variable/

2. For the data, use the following link 
http://s3.amazonaws.com/open_data/opendata_projects000.gz
add data fields in the first line

https://github.com/adilmoujahid/DonorsChoose_Visualization/issues/10

The new file does not seem to contain header values. Simply copy/paste this as the first line in the csv file:
"_projectid","_teacher_acctid","_schoolid","school_ncesid","school_latitude","school_longitude","school_city","school_state","school_zip","school_metro","school_district","school_county","school_charter","school_magnet","school_year_round","school_nlns","school_kipp","school_charter_ready_promise","teacher_prefix","teacher_teach_for_america", "teacher_ny_teaching_fellow","primary_focus_subject","primary_focus_area","secondary_focus_subject","secondary_focus_area","resource_type","poverty_level","grade_level","vendor_shipping_charges","sales_tax","payment_processing_charges","fulfillment_labor_materials","total_price_excluding_optional_support","total_price_including_optional_support","students_reached","total_donations","num_donors","eligible_double_your_impact_match","eligible_almost_home_match","funding_status","date_posted","date_completed","date_thank_you_packet_mailed","date_expiration" 

the data file is huge, import the csv to excel, query editor to add index column and only choose index <=50K, then close and load to reduce the data size. 
https://superuser.com/questions/1414244/limiting-the-number-of-rows-imported-into-excel-from-a-large-csv-file

3. import the data, in regular command line
mongoimport -d donorschoose -c projects --type csv --file opendata_projects_f.csv --headerline

4. start another console 
mongo
use donorschoose
show collections
db.projects.findOne()
note it is case sensitive
find 5 attributes

5. Interacting with MongoDB using Python
python_mongodb.py

6. Buiding the server
python app.py
[this is the server]
http://localhost:5000/donorschoose/projects
[to see the server data, like check data is available.]

7. prepare the front-end
static\js\graphs.js

8. all the charts are written in templates/index.html

http://localhost:5000/ to see the charts but it has debug issues. 

