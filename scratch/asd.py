import pandas as pd
import datetime
from bokeh.io import show, output_file
from bokeh.models import ColumnDataSource, HoverTool
from bokeh.plotting import figure
from bokeh.palettes import Spectral5, Spectral4
from bokeh.sampledata.autompg import autompg_clean as df
from bokeh.transform import factor_cmap

# Load data, creating data
table = pd.read_csv('data/growths_top.csv')
df = table.PewDiePie.to_frame()
replacement = {}
i = 0
month = 4
years = []
year = 2015
for index, row in df.iterrows():
    if month == 13:
        month = 1
        year += 1
    month_str = datetime.date(1900, month, 1).strftime('%B')
            
    replacement[i] = '{}'.format(month, year)
    years.append(year)
    row['month'] = month

    month += 1
    i += 1

df.rename(replacement, inplace=True)
df['year'] = years

from bokeh.core.properties import value
from bokeh.io import show, output_file
from bokeh.models import ColumnDataSource
from bokeh.plotting import figure
from bokeh.transform import dodge

output_file("dodged_bars.html")

year = ['2015', '2016', '2017']
month = list(df.index.unique())

data = {}
last_add = 0
for index, row in df.iterrows():
    try:
        data[index].append(row.PewDiePie)
    except:
        data[index] = [row.PewDiePie]

for key, value in data.items():
    while len(data[key]) < 3:
        data[key] = [0] + value

data['year'] = year

from pprint import pprint
pprint(data)
"""
data = { 'year' = [2015, 2016, 2017],
 1: [0, 41131656, 51617009],
 2: [0, 41740632, 52712443],
 3: [0, 42370268, 53765451],
 4: [35530088, 42912756, 54301946],
 5: [36168693, 43501267, 54707342],
 6: [36768508, 44617297, 55064461],
 7: [37432374, 45576949, 55798040],
 8: [38235047, 46762751, 56446495],
 9: [38836029, 47446800, 56985807],
 10: [39438173, 47984010, 57201026],
 11: [39990232, 48831019, 57543249],
 12: [40477991, 49199545, 57929718]}
"""

source = ColumnDataSource(data=data)

print(source)

p = figure(x_range=year, y_range=(0, 60000000), plot_height=250, title="Subscriber gain", toolbar_location=None, tools="")
print(p.x_range)

p.vbar(x=dodge('year', -0.25, range=p.x_range), top='2015', width=0.2, source=source,
       color="#c9d9d3")

p.vbar(x=dodge('year',  0.0,  range=p.x_range), top='2016', width=0.2, source=source,
       color="#718dbf")

p.vbar(x=dodge('year',  0.25, range=p.x_range), top='2017', width=0.2, source=source,
       color="#e84d60")

p.x_range.range_padding = 0.1
p.xgrid.grid_line_color = None
p.legend.location = "top_left"
p.legend.orientation = "horizontal"

show(p)