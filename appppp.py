'''import os 
from random import randint

for i in range(1, 150):
    for j in range (0, randint(1,10)):
        d = str(i) + 'days ago'
        with open('file.txt', 'a') as file:
            file.write(d)
        os.system('git add .')
        os.system('git commit --date="' + d + '" -m "commit"')

os.system("git push -u origin main")

import os
from datetime import datetime, timedelta
from random import randint

# Define the start date (February 1st this year) and the end date (today)
start_date = datetime(year=2024, month=2, day=1)  # Adjust the year as necessary
end_date = datetime.now()

current_date = start_date

while current_date <= end_date:
    # Random number of commits for the day
    for _ in range(randint(1, 10)):
        date_str = current_date.strftime('%Y-%m-%d')
        commit_message = f"Commit from {date_str}"
        
        with open('file.txt', 'a') as file:
            file.write(f"{date_str} data\n")

        # Use environment variable to set GIT_AUTHOR_DATE and GIT_COMMITTER_DATE
        os.system(f'git add .')
        os.system(f'git commit --date="{date_str}T12:00:00" -m "{commit_message}"')

    # Move to the next day
    current_date += timedelta(days=1)

# Push changes to GitHub
os.system("git push -u origin main")'''

import os
import subprocess
from datetime import datetime, timedelta
from random import randint, sample

# Explicitly set the year to 2024
current_year = 2024

# Define end date (July 22, 2024)
end_date = datetime(current_year, 7, 22)

# Define start date (February 1st, 2024)
start_date = datetime(current_year, 2, 1)

# Calculate the number of days between start and end dates
total_days = (end_date - start_date).days + 1

# Decide the number of random days you want to pick for commits
num_random_days = min(150, total_days)  # Adjust this number as needed, but don't exceed total days

# Generate a list of random days within the date range
random_days = sorted(sample(range(total_days), num_random_days))

# Iterate through each random day and create commits
for day_offset in random_days:
    commit_date = start_date + timedelta(days=day_offset)
    date_str = commit_date.strftime('%Y-%m-%d %H:%M:%S')

    # Generate a random number of commits for each selected day
    for _ in range(randint(1, 10)):
        with open('file.txt', 'a') as file:
            file.write(f"Commit for {date_str}\n")
        os.system('git add file.txt')
        os.system(f'git commit --date="{date_str}" -m "commit for {date_str}"')

# Get current local branch name
current_branch = subprocess.check_output(['git', 'rev-parse', '--abbrev-ref', 'HEAD']).decode().strip()

# Ask user for remote branch name
remote_branch = input(f"Enter the name of the remote branch you want to push to (default: {current_branch}): ").strip() or current_branch

# Push all changes to the specified remote branch
push_command = f"git push -u origin {current_branch}:{remote_branch}"
push_result = os.system(push_command)

if push_result != 0:
    print(f"Push failed. Please ensure that you have permission to push to '{remote_branch}' on the remote.")
    print("If the remote branch doesn't exist, you can create it with:")
    print(f"git push -u origin {current_branch}:{remote_branch}")
else:
    print(f"Successfully pushed to remote branch '{remote_branch}'.")
