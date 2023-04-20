# Searches in all files for html <form>, <input>, or <select> elements
# in order to find all form definitions in the project

import os
directories=[".",".\\templates",".\\js"]
for dirName in directories:
    files=os.popen("dir "+dirName+" /B").read()
    for filename in files.split("\n"):
        try:
            file=open(dirName+"\\"+filename)
            lineNumber=0
            found=False
            for line in file:
                if "<form" in line or "<input" in line or "<select" in line:
                    if not found:
                        print("\n["+dirName+"\\"+filename+"]")
                    found=True
                    print("[ ] @"+str(lineNumber)+"\t"+line.strip())
                lineNumber+=1
            close(file)
        except:
            continue
