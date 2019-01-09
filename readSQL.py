import sqlite3
import ast


connection = sqlite3.connect('participants.db')
cursor = connection.cursor()
cursor.execute("SELECT * FROM turkdemo") #turkdemo
results = cursor.fetchall()
map_str = lambda x: ','.join(map(str, x))

null=None
true=True
false=False

#output = []
header = ['worker_id','assignment_id','uniqueid','pid','datetime',
            'trial_id','jitter','exp_duration','loc_x','loc_y','N_colors','color', 'n_shown',
            'n_guess','rt']
output = [map_str(header)]


t_num = 0
for r in results:
    #print r

    #try:
    #dic = eval(r[16].encode('ascii','ignore'))
    #dic = r[16].encode('ascii','ignore')
    dic= eval(r[len(r)-1].encode('ascii', 'ignore'))
    #except:
      #  pass

    if 'data' in dic:
        trial = dic['data'] 


        for t in trial:

            header = [x for x in t]
            tt = t['trialdata']
            if tt['phase']=='TEST':
                print tt
                #if len(header) == 0:
                #pos = tt['pos_x']
               # p_x = pos[0]
                #p_y=pos[1]
              #  p_x =tt['pos_x']
               # p_y =tt['pos_y']
                out = [dic['workerId'],dic['assignmentId'],
                     t['uniqueid'],tt['pid'],t['dateTime'],
                     tt['trial_id'],    tt['jitter'],  tt['exp_duration'], 
                     tt['loc_x'], tt['loc_y'],tt['N_colors'], tt['color'],
                      tt['N_colored'], tt['N_guessed'],tt['rt']]
                #out.extend(t['trialdata'])
                

                output.append(map_str(out))
                t_num += 1
   # except:
     #   print "didn't work"
      #  pass    

for o in output:
    print o
with open('data.csv','w') as f:
    f.write('\n'.join(output))
    f.close()
    

