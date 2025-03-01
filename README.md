AWS EC2 Setup and Backend Deployment

1. Connect to EC2 Instance
ssh -i your-key.pem ec2-user@your-ec2-ip

2. Update Packages and Install Dependencies
sudo yum update -y
sudo yum install python3-pip -y
pip3 install flask flask_cors boto3 requests

3. Create and Configure Backend Scripts
**Create **``: This script fetches and analyzes news data, then stores it in DynamoDB.

**Create **``: This script sets up a Flask server to provide news data to the frontend.

4. Run Backend Server
nohup python3 app.py > output.log 2>&1 &
Verify if the server is running:
curl http://your-ec2-ip:5000

5. Security Group Configuration
Ensure ports 5000 (API), 80 (HTTP), and 443 (HTTPS) are open in AWS Security Groups.
Frontend Setup (React + TailwindCSS)

1. Install Node.js and Dependencies
sudo yum install nodejs -y
npm install -g npm

2. Set Up React Project
npx create-react-app stock-news-dashboard
cd stock-news-dashboard
npm install axios tailwindcss

3. Configure TailwindCSS
npx tailwindcss init
Modify tailwind.config.js to include:
content: ["./src/**/*.{js,jsx,ts,tsx}"]

4. Add NewsDashboard Component
Create NewsDashboard.jsx inside src/components
Fetch news data from backend (http://your-ec2-ip:5000/get-news)
Display categorized news

5. Run Frontend
npm run dev
If npm start doesn't work, use npm run dev.
Automating News Refresh Every 3 Hours

1. Modify fetch_news.py to Run in Background Every 3 Hours
Use a while loop with time.sleep(10800) (3 hours) instead of crontab.

2. Run fetch_news.py
nohup python3 fetch_news.py > fetch_output.log 2>&1 &

Check logs:
tail -f fetch_output.log


Handling Indian News API Integration
Modify API base URL in fetch_news.py to https://stock.indianapi.in/news.
Use API key: your own.
Store and categorize Indian stock news similarly.

Verifying Everything Works
Backend: curl http://your-ec2-ip:5000/get-news
Frontend: Load in browser and verify news is displayed
DynamoDB: Check if new news entries are stored every 3 hours.

Notes:;;
EC2 instance should remain running for automation.
Refresh button is optional; news reloads on page refresh.
Security groups must allow incoming traffic on necessary ports.
Use ps aux | grep python to check running scripts.
Use pkill -f app.py or pkill -f fetch_news.py to stop a script if needed.


