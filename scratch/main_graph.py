import pandas as pd
import datetime
from bokeh.io import show, output_file
from bokeh.models import ColumnDataSource, HoverTool
from bokeh.plotting import figure
from bokeh.palettes import Spectral5, Spectral3
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

    month += 1
    i += 1

df.rename(replacement, inplace=True)
df['year'] = years


group = df.groupby(('year')).count()
index_cmap = factor_cmap('per_year', palette=Spectral3, factors=sorted(df.year.unique()), end=1)

p = figure(plot_width=800, plot_height=300, title="Main Graph",
           x_range=group, toolbar_location=None, tools="")

p.vbar(x='per_year', top='mpg_mean', width=1, source=source,
       line_color="white", fill_color=index_cmap, )

p.y_range.start = 0
p.x_range.range_padding = 0.05
p.xgrid.grid_line_color = None
p.xaxis.axis_label = "Manufacturer grouped by # Cylinders"
p.xaxis.major_label_orientation = 1.2
p.outline_line_color = None

p.add_tools(HoverTool(tooltips=[("MPG", "@mpg_mean"), ("Cyl, Mfr", "@cyl_mfr")]))

show(p)


