
import pandas as pd

data = pd.read_csv(f'data/{fname}.txt', sep='\t')
eng = []
eng = data.iloc[:,0].tolist()


# <tr>
#     <th>Company</th>
#     <th>Contact</th>
#     <th>Country</th>
#   </tr>
#   <tr>
#     <td>Alfreds Futterkiste</td>
#     <td>Maria Anders</td>
#     <td>Germany</td>
#   </tr>
#   <tr>
#     <td>Centro comercial Moctezuma</td>
#     <td>Francisco Chang</td>
#     <td>Mexico</td>
#   </tr>