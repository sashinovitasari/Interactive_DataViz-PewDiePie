import pandas as pd
import datetime

table = pd.read_csv('data/growths_top.csv')
poods_growth = table['PewDiePie']

replacement = {}
i = 0
month = 4
year = 2015
for row in poods_growth:
    if month == 13:
        month = 1
        year += 1
    month_str = datetime.date(1900, month, 1).strftime('%B')
            
    replacement[i] = '{}-{}'.format(month, year)
    
    month += 1
    i += 1

poods_growth = poods_growth.rename(replacement)

from bokeh.io import show, output_file
from bokeh.plotting import figure

output_file("main_graph.html")

x_axis = list(poods_growth.index)
y_axis = list(poods_growth)

p = figure(x_range=x_axis, plot_height=430, title="Fruit Counts", tools="pan,wheel_zoom,box_zoom,reset,filter", 
		   plot_width=800)

p.vbar(x=x_axis, top=y_axis, width=0.4)

p.xgrid.grid_line_color = None
p.y_range.start = 0

show(p)