# Chicago Traffic Crash Data Warehouse and Analytics System

In December 2024, I completed a comprehensive data warehouse project at the University of Pisa as part of the Laboratory of Data Science course. Working with Alessandro Carella and Sara Hoxha, we developed an end-to-end business intelligence solution analyzing Chicago traffic crash data to support insurance company decision-making through sophisticated dimensional modeling, ETL pipelines, OLAP cubes, and interactive dashboards.

## Project Repository and Team

The complete project is available on GitHub at [lds-dw-modelling](https://github.com/SaraHoxha/lds-dw-modelling). This was a collaborative effort with Alessandro Carella and Sara Hoxha, where we divided responsibilities across data cleaning, schema design, ETL development, OLAP implementation, and dashboard creation. The project demonstrates a complete data warehousing lifecycle from raw data to actionable business insights.

## Data Understanding and Comprehensive Cleaning

We began with three raw CSV files from Chicago's traffic crash database: People.csv, Vehicles.csv, and Crashes.csv. The data understanding phase revealed numerous quality issues that required systematic resolution.

### People Data Challenges and Solutions

The People table contained detailed information about individuals involved in crashes, including demographics, location, and behavior during incidents. Initial exploration revealed 14 columns with missing values, incorrect data types, and inconsistent representations of unknown values. The AGE column was stored as floating-point when it should have been integer, and close to 20,000 entries had ages of 0 or unrealistically young ages for drivers.

We implemented nine specific cleaning operations. When STATE was missing, we used the CITY column to infer it by referencing an external CSV containing comprehensive US city-state mappings. We mapped NaN values in the SEX column to "U" for Unknown to maintain consistency, though we preserved the uncommon "X" value as it may represent intentional non-specification. For columns already containing an "Unknown" value, we filled missing observations with that value: CITY, DRIVER_ACTION, DRIVER_VISION, PHYSICAL_CONDITION, and EJECTION all received "UNKNOWN", while AIRBAG_DEPLOYED received "DEPLOYMENT UNKNOWN" and SAFETY_EQUIPMENT received "USAGE UNKNOWN".

We converted VEHICLE_ID and AGE to integers to standardize the data. For passengers, we added a new value 'N/A' for missing values in DRIVER_VISION and DRIVER_ACTION columns since these fields are not applicable to non-drivers. The CRASH_DATE column was split into four separate columns: DAY, MONTH, YEAR, and TIME to enable more granular temporal analysis. We set AGE to NaN when it was less than 10 and PERSON_TYPE was DRIVER, based on the assumption that anyone under 10 cannot legally drive. Finally, we set CITY to Unknown when it was numeric, had length less than 2, or started with "UNK", and we set STATE to Unknown when CITY was UNKNOWN or STATE was "XX".

### Vehicles Data Standardization

The Vehicles table provided comprehensive information about vehicles involved in crashes, with each record representing a distinct unit. The table included attributes like UNIT_TYPE, LIC_PLATE_STATE, VEHICLE_DEFECT, and temporal information.

We standardized multiple attributes containing NaN values to 'UNKNOWN' for consistency: UNIT_TYPE, VEHICLE_DEFECT, VEHICLE_TYPE, VEHICLE_USE, VEHICLE_DIRECTION, MANEUVER, and FIRST_CONTACT_POINT. Both NaN values and 'XX' entries in LIC_PLATE_STATE were consolidated to 'UNKNOWN'. The MODEL field contained both 'UNKNOWN' and 'UKNOW' which we standardized to 'UNKNOWN', and years recorded beyond 2024 were marked as 'UNKNOWN' as they represent impossible future dates. We identified a special case where '999' appeared, potentially representing a typo for '1999'.

### Crashes Data Enhancement

The Crashes dataset provided spatial, temporal, and severity information about incidents. We corrected two entries in the RD_NO column that had lowercase letters (hz273623 and hz125235) to align with the dataset's standard format.

For missing values, REPORT_TYPE had 4,996 out of 257,925 entries lacking values. Since reliable inference methods were unavailable and the Chicago police department website indicated missing values as AMENDED, we left these as missing. The STREET_DIRECTION column had two missing values which we attempted to impute using TRAVEL_DIRECTION from the Vehicles dataset, but this was unsuccessful.

Initially, many values were missing for LATITUDE, LONGITUDE, POINT, and BEAT_OF_OCCURRENCE. Using the STREET_NAME and STREET_NO fields with a geocoding API, we obtained most of the missing values for LATITUDE, LONGITUDE, and POINT. Using these found values, we filled almost all missing values in BEAT_OF_OCCURRENCE by finding perfect matches of the POINT column in other records. Just one record remains missing BEAT_OF_OCCURRENCE and exists at a unique point.

We created a new derived feature, DELTA_TIME_CRASH_DATE_POLICE_REPORT_DATE, to quantify the time difference between crash occurrence and police notification, expressed in the format "days minutes seconds". Numeric columns such as NUM_UNITS, INJURIES_TOTAL, and various injury subcategories were converted to integer type for consistency.

## Snowflake Schema Design for Insurance Analytics

We designed a snowflake schema optimized for an insurance company's analytical needs, with a central fact table and multiple normalized dimension tables. This structure reduces data redundancy while enabling efficient querying of complex relationships.

### Fact Table: DamageReimbursement

The central fact table, DamageReimbursement, contains transactional data related to reimbursements for damages caused by crashes. It has a composite primary key comprised of three foreign keys: Crash_ID, Person_ID, and Vehicle_ID, linking to respective dimensions. The attribute Cost_Category classifies reimbursements based on value ranges, while the measure Cost quantifies the total reimbursement amount. This structure enables efficient tracking of reimbursements related to specific crashes, vehicles, and people, with the foreign keys ensuring comprehensive relationships and the ability to drill down into details when needed.

### Dimension Tables and Normalization

The Crash dimension is normalized into three sub-dimensions: CrashLocation, CrashCondition, and Injury. This normalization approach avoids redundancy such as repeating location data for multiple crashes, improves data integrity, and enables granular analysis of specific crash aspects.

CrashLocation stores geographic and physical location information for each crash, with Crash_Location_ID as the primary key and attributes including Street_No, Latitude, Longitude, and Beat_of_Occurrence. CrashCondition captures environmental factors surrounding each crash, such as weather, road conditions, and traffic control, with Crash_Condition_ID as the primary key. This enables analysis of crashes based on various environmental and situational factors. The Injury dimension contains numerical data on injury types and severity with Injury_ID as the primary key, composed of measures including Injuries_Total, Injuries_Fatal, and Injuries_No_Indication.

The DateTime dimension stores temporal information with DateTime_ID as the primary key and attributes Day, Month, Year, and Time. It allows for time-based analysis, helping identify patterns in crash frequency. This dimension serves as a role-playing dimension, shared between the Crash and Vehicle dimensions to reference temporal attributes consistently.

The Person dimension contains detailed individual information with Person_ID as the primary key, including demographic attributes like Sex, Age, and Safety_Equipment usage. The Vehicle dimension stores vehicle details with Vehicle_ID as the primary key and attributes like Make, Model, and Defect, helping identify patterns related to specific vehicle types and their potential influence on crash severity.

## ETL Pipeline Development with SSIS

For the data loading phase, we faced a challenge with the assignment's 10% sampling requirement. Given the referential integrity constraints in our snowflake schema, obtaining exactly 10% of data across all tables wasn't feasible without compromising data consistency. We employed a top-down sampling approach where parent tables without foreign keys were sampled using SSIS's percentage sampling operation to achieve a 10% subset, while child tables with foreign key dependencies were filtered to include only records associated with sampled parent data.

While this resulted in less than 10% of data in child tables, it preserved referential integrity, ensuring no orphaned records or invalid references existed. The sampled dataset remained coherent and suitable for query testing. We implemented this using SQL Server Integration Services, creating data flow tasks with lookup transformations, derived column transformations, conditional splits, and aggregate transformations to move data from the cleaned CSV files into our data warehouse.

## Complex SQL Queries for Business Intelligence

We developed four complex SQL queries addressing specific insurance company analytical needs.

### Query 6a: Crash Frequency by Participant

This query analyzes crash involvement frequency for all participants across different years to identify individuals with higher crash frequencies. We extracted demographic details from the Person table, linked to DamageReimbursement to retrieve crash IDs, then joined to the Crash and DateTime tables to extract crash years. Data was aggregated by counting crashes for each participant per year, generating a "Total Crashes" metric, then sorted chronologically to provide a clear overview of crash frequency patterns.

### Query 7a: Day-Night Crash Index by Police Beat

This query calculates a day-night crash index per police beat by comparing vehicle counts in nighttime incidents (9 PM to 8 AM) versus daytime (8 AM to 9 PM). We extracted Number_of_Units from Crash, Beat_of_Occurrence from CrashLocation, and timestamps from DateTime, joining sequentially on IDs. A derived column transformation created a Time_Category field classifying each crash as "Day" or "Night". Data was split by Time_Category, aggregated by Beat_of_Occurrence, and summed for vehicle counts. The final ratio calculation used a derived column transformation handling division by zero cases, setting the index to 0 when no daytime crashes existed.

### Query 8a: Age-Based Crash Ratios by Location and Weather

This query calculates the ratio of people under 21 to those over 21 for each quarter, weather condition, and beat of occurrence. This analyzes how seasonality, weather, and location affect crash proportions by age, helping insurance companies understand young driver behavior. We joined DamageReimbursement, Crash, CrashLocation, CrashCondition, DateTime, and Person tables using SSIS lookup operations. After counting individuals over and under 21, we aggregated by the required columns and created a new column containing the ratio.

### Query 9a: Interstate Movement Analysis for Elderly Drivers

Building on previous analyses, this query examines the ratio of older individuals (over 60) involved in interstate movements in Chicago, analyzing whether they reside in Chicago and whether their vehicles are registered in other states. We incorporated quarterly variations to capture seasonality. Using lookup transformations to retrieve only necessary attributes, we classified individuals as over or under 60, aggregated by quarter and license plate registration, calculated the ratio, and sorted the results.

## OLAP Cube Implementation

We designed a multidimensional OLAP cube using SQL Server Analysis Services to enable sophisticated analytical queries. The cube stores and analyzes Chicago traffic crash data with dimensions for Person, Crash, Vehicle, and DateTime.

### Dimension Design with Hierarchies

The Person dimension includes attributes like Person_ID (formatted as 'PersonID-Type-Sex-Age'), Injury_Classification, Physical_Condition, Age, Type, Sex, Driver_Action, Driver_Vision, Age_Group (containing groups 'Under 18', 'Over 65', '18-35', '36-50', '51-65'), City, and State.

The Crash dimension has a complex structure with Crash_ID (formatted as 'CrashID-Primary Contributory Cause'), Crash_Date_ID, Police_Notified_Date_ID, Crash_Location_ID (formatted as 'CrashLocationId-Street-StreetNo'), Crash_Condition_ID (formatted as 'CrashConditionID-Weather Condition-LightningCondition'), Injury_ID (displayed as Injuries Total), Primary_Contributory_Cause, Secondary_Contributory_Cause, and various location attributes.

The Vehicle dimension contains Vehicle_ID (formatted as 'VehicleID-Make-Model') and Vehicle_Type. The DateTime dimension includes Date_Time_ID (formatted as 'Year-Month-Day'), Day, Year, Month_Name (textual month names), and Time in 24-hour format. This role-playing dimension represents both Crash Date and Police Notified Date.

The DateTime dimension includes a hierarchy: Year → Month → Day → Time. Following OLAP best practices, access to these hierarchical attributes is not directly visible to end-users.

### Measure Groups

The Damage Reimbursement measure group captures financial data including Cost, Damage_Reimbursement_Count, and Average_Cost, essential for assessing financial impact. The Person measure group provides insights into the number and type of individuals involved, including Person_Count, Count_of_Person_Type, and Fatal_Crashes.

After building and defining the structure, we processed the data and deployed the cube on the OLAP server, enabling MDX queries and analysis directly within the cube environment.

## Advanced MDX Query Development

We developed five sophisticated MDX queries demonstrating different analytical capabilities.

### Query 2: Total Damage Costs by Location and Month

This query shows total damage costs for each location and month with grand totals. We used WITH MEMBER to define custom grand totals for both months and locations, aggregating totals across all entries. This allowed us to give clear column names instead of using the default "All" and specify placement in the result set. The Hierarchize function correctly orders months, listing individual months first followed by the yearly total. For locations, we used Filter to exclude the All member, ensuring only individual locations appear, then added the grand total to replace the default All member.

### Query 4: Year-over-Year Damage Cost Changes

This query shows damage cost changes percentage-wise relative to the previous year for every location. We used two WITH MEMBER clauses: one to name the damage cost of the previous year, and another to create the percentage change measure. For the specific year selected, we displayed 2017 data with cost and percentage change on columns and crash location in rows.

### Query 6: Highest Damage by Vehicle Type and Year

This query shows for each vehicle type and year the information and total damage costs of the person with the highest reported damage. We selected Total Cost as the sum of each current member of Person for their cost. The rows use a nested function taking only non-empty values, generating combinations between year and vehicle type, then extracting the top 1 person for each year-vehicle type combination measured by cost.

### Query 7: Median and Maximum Reporting Delays

This query calculates median and maximum time delays between crash occurrence and police notification for each beat of occurrence, providing insights into typical and extreme reporting delays. We defined TotalDelaySeconds to compute total delay in seconds by extracting and converting components (days, hours, minutes, seconds) from the Difference_Between_Crash_Date_And_Police_Notified field. Median and maximum delays were calculated using MEDIAN and MAX functions, formatted into human-readable strings with null handling. Results displayed beats in descending order of median delay to prioritize significant findings, revealing substantial differences between beats in reporting behavior.

### Query 8a: Most Frequent Crash Causes with Weighted Analysis

This query identifies the most frequent crash cause for each year, calculates associated total damage costs, and determines the overall most frequent crash cause. We weighted the primary crash contributing factor twice as much as the secondary factor using WeightedCauseCount. The most frequent cause per year was determined using TOPCOUNT, ranking crash causes by weighted frequency within each year. Total damage costs for the top cause were aggregated in TotalCostPerYearTopCause, filtering for entries matching the most frequent cause. The overall most frequent cause was identified by ranking crash causes using TOPCOUNT without time restrictions. Results displayed the most frequent crash cause per year, its total damage costs, and the overall most frequent cause.

## Interactive Dashboard Development

We created three comprehensive dashboards in Power BI to visualize key insights for insurance company stakeholders.

### Geographical Dashboard: Spatial Analysis of Damage Costs

The geographical dashboard showcases the distribution of total damage costs by vehicle category with interactive filtering capabilities. Two primary filters on the left allow users to select specific beats of occurrence and vehicle types dynamically. The middle column features a treemap at the top highlighting total damage costs for selected vehicle categories, providing a hierarchical overview of cost distributions. Below, a bar plot displays the same data with beat of occurrence comparison context in a detailed format.

On the right, a map visualization provides spatial insights, focusing on the Chicago area by default when all beats are selected. The map dynamically updates to reflect chosen beats, allowing exploration of specific regions and identification of areas with higher damage cost concentrations. Users can manipulate filters to adapt displayed data, enabling nuanced analyses of relationships between geographical locations and vehicle-related damage costs.

### Streets Dashboard: Mobility and Location Analysis

This dashboard provides insights into cost and damage reimbursement by street, helping the insurance company locate and analyze mobility dynamics when granting insurance agreements or paying damages. The visualizations include total cost metrics, average cost increase by year, count of damage reimbursements by street, and a street map showing the top 10 streets with highest costs in Chicago. These visualizations together help determine new policies for the insurance company by revealing patterns in street-level crash costs and frequencies.

### People Dashboard: Demographic and Behavioral Analysis

The People dashboard provides actionable information about crash participants for business analysts. At the top left, a pie chart titled "Proportion of Crash Participants by Physical Condition" identifies the impact of factors such as impairment due to drugs, alcohol, or medical conditions, helping understand the role of human factors and tailor risk models. The map visualizes geographical concentrations of crashes, allowing insurers to pinpoint high-risk regions for premium adjustments.

The bottom left bar chart provides insight into crash costs by age group and vision impairments, revealing that younger drivers (under 18) and those with specific vision conditions incur higher costs, identifying high-risk demographics for targeted pricing. The treemap "Driver Action by Injury Breakdown" uncovers how specific driver behaviors (failure to act, distracted driving) correlate with injuries, showing potential needs to adjust premiums for policyholders exhibiting these patterns.

Central KPIs display Participants in Crashes, Total Damage Cost, Fatal Crashes, and Average Damage Cost, providing an immediate overview of claim volume and financial exposure crucial for forecasting payments and ensuring sufficient reserves. The dashboard offers three types of slicers—Age, Sex, and Type—that dynamically update all plots, allowing detailed analysis effortlessly. The cohesive blue theme provides an aesthetically pleasing and coherent look, enhancing user experience and ensuring clarity in data visualization.

## What I Learned

This project provided deep insights into the complete business intelligence lifecycle, from raw data to actionable insights. Working with Alessandro and Sara, I learned the importance of early and thorough data quality assessment. We discovered that seemingly small data quality issues—like inconsistent "Unknown" value representations or incorrect data types—can cascade into significant problems during dimensional modeling and cube processing. Our systematic approach to documenting each cleaning decision in the preprocessing phase saved us countless hours during later development stages.

The dimensional modeling phase taught me to think from the business user's perspective. Initially, I was inclined toward a fully normalized star schema, but through team discussions, we realized that the insurance company's analytical needs required the flexibility of a snowflake design. The normalization of the Crash dimension into CrashLocation, CrashCondition, and Injury sub-dimensions seemed complex at first, but it proved essential for avoiding redundancy and enabling granular analysis. This experience reinforced that data warehouse design is fundamentally about understanding business questions, not just database theory.

Implementing the ETL pipeline using SSIS challenged my problem-solving skills significantly. The sampling requirement seemed straightforward until we confronted the reality of referential integrity constraints. Our initial attempts at uniform 10% sampling across all tables produced orphaned records and invalid foreign keys. The breakthrough came when we adopted the top-down sampling approach, accepting that mathematical perfection sometimes conflicts with practical data integrity. This taught me that in data engineering, pragmatic solutions that preserve data quality often trump theoretically ideal approaches.

Developing MDX queries was initially intimidating given the unfamiliar syntax, but I discovered that thinking in terms of dimensions, hierarchies, and measures rather than rows and tables unlocked powerful analytical capabilities. Query 7, calculating median and maximum reporting delays, required converting time components into seconds, then formatting results back into human-readable strings—a complex transformation that taught me the value of computed measures in OLAP cubes. The weighted analysis in Query 8a, where primary causes counted twice as much as secondary causes, showed me how MDX enables sophisticated business logic that would be cumbersome in standard SQL.

Creating the three dashboards in Power BI revealed the art of visual storytelling with data. My initial dashboard designs were cluttered with every possible visualization, but feedback from the team helped me understand that effective dashboards guide users toward insights rather than overwhelming them with information. The geographical dashboard's interactive filtering, the streets dashboard's cost trend analysis, and the people dashboard's demographic breakdowns each tell a focused story about different aspects of crash data. I learned that choosing the right visualization type—treemaps for hierarchical cost distributions, maps for spatial patterns, bar charts for comparisons—is as important as the underlying data quality.

Collaborating on this project taught me valuable lessons about division of labor and knowledge sharing. We established clear ownership of different components while maintaining regular communication about interdependencies. When Alessandro discovered the geocoding API that filled most of our missing location values, it dramatically improved the spatial analysis capabilities in my geographical dashboard. When Sara identified the vehicle year anomaly with '999' potentially being a typo for '1999', it prompted us to implement more robust data validation rules. These cross-functional insights would have been impossible working in isolation.

The project also taught me patience with iterative development. Our first OLAP cube deployment failed because we hadn't properly configured the DateTime role-playing dimension. Our initial MDX queries ran for minutes before timing out because we hadn't optimized aggregations. Our first dashboard crashed Power BI Desktop because we tried loading the entire dataset without proper data reduction. Each failure became a learning opportunity that improved our understanding of the entire BI stack.

Perhaps the most valuable insight came from considering the end user perspective. As data professionals, we naturally focus on technical elegance—efficient queries, normalized schemas, optimized cubes. But the insurance company stakeholders who would use this system care about answering business questions: Which beats have the highest crash costs? Which demographics are riskiest? How do environmental factors affect claim severity? Keeping these business questions central to our design decisions ensured that our technically sophisticated solution remained practically useful.

This project bridged academic learning and real-world application. We applied theoretical concepts from data warehousing, OLAP, and business intelligence to a substantial real-world dataset with all its messy complexity. The experience of cleaning 257,925 crash records, designing a snowflake schema with multiple role-playing dimensions, writing sophisticated MDX queries, and creating interactive dashboards has given me confidence that I can tackle enterprise-scale BI projects. More importantly, it taught me that successful data warehousing isn't just about mastering tools and techniques—it's about understanding business needs, making pragmatic design trade-offs, collaborating effectively, and telling compelling stories with data.
