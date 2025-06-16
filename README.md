# Korean DramaList Drama Scraper

A comprehensive web scraping tool that extracts detailed information about Asian dramas from MyDramaList.com, specifically focusing on Chinese dramas with completed status.

## 📋 Project Overview

This Python-based web scraper automatically collects detailed drama information from MyDramaList, including titles, ratings, cast information, genres, synopsis, and various statistics. The scraper is designed to handle large-scale data collection efficiently using asynchronous programming.

## 🎯 Features

- **Comprehensive Data Extraction**: Scrapes 20+ data points per drama
- **Asynchronous Processing**: Fast, non-blocking web requests using Playwright
- **Robust Error Handling**: Graceful handling of missing data and network issues
- **CSV Export**: Automatically saves data in a structured CSV format
- **Smart Parsing**: Advanced text parsing for dates, ratings, and statistics

## 📊 Data Collected

The scraper extracts the following information for each drama:

### Basic Information
- Title
- Year of release
- Rating/Score
- Synopsis
- Content rating
- Number of episodes
- Duration per episode

### Production Details
- Directors
- Screenwriters
- Original network
- Air dates (start and end)

### Cast Information
- Main actors (top 4)
- Character names
- Role types

### Metadata
- Genres
- Tags
- Statistics (ranking, popularity, watchers)
- MyDramaList URL

## 🛠️ Technologies Used

- **Python 3.7+**
- **Playwright**: Modern web automation for dynamic content handling
- **BeautifulSoup4**: HTML parsing and data extraction
- **AsyncIO**: Asynchronous programming for improved performance
- **CSV**: Data export and storage
- **Regular Expressions**: Advanced text pattern matching

## 📋 Prerequisites

Before running the scraper, ensure you have Python 3.7+ installed, then install the required dependencies:

```bash
pip install playwright beautifulsoup4 nest-asyncio
playwright install
```

## 🚀 Usage

### Basic Usage
```python
import asyncio
import nest_asyncio

# Apply nest_asyncio for Jupyter/Colab compatibility
nest_asyncio.apply()

# Run the scraper
await main()
```

### Customization Options

The scraper can be easily customized by modifying the search parameters:

```python
# Current configuration: Chinese dramas, completed status
url = f"https://mydramalist.com/search?adv=titles&ty=68,77,83,86&co=3&st=3&so=top&page={page_num}"

# Parameters:
# ty=68,77,83,86: Drama types (TV Series, Web Series, etc.)
# co=3: Country (3 = China)
# st=3: Status (3 = Completed)
# so=top: Sort by top-rated
```

### Adjusting Page Range
```python
for page_num in range(1, 204):  # Modify range as needed
```

## 📁 Output

The scraper generates a CSV file (`drama_dataset.csv`) with all collected data. Each row represents one drama with all extracted information in separate columns.

### Sample Output Structure
```csv
title,year,rating,genres,tags,synopsis,score,ranked,popularity,watchers,directors,screenwriters,main_actors,url
"The Untamed",2019,"9.0","['Historical', 'Romance']","['Bromance', 'Novel']","Wei Wuxian and Lan Wangji...",9.0,"#1","#5","234,567,"['Chen Jia Lin']","['Chen Qing Ling Team']","[{'name': 'Xiao Zhan', 'character': 'Wei Wuxian'}]","https://mydramalist.com/..."
```

## ⚠️ Important Notes

### Rate Limiting & Ethics
- The scraper includes delays to respect server resources
- Use responsibly and in accordance with MyDramaList's terms of service
- Consider implementing additional delays for larger-scale scraping

### Error Handling
- Failed requests are logged but don't stop the entire process
- Missing data fields are handled gracefully with empty defaults
- Network timeouts are set to 60 seconds for reliable operation

## 🔧 Configuration

### Browser Settings
The scraper uses Chromium in headless mode with a realistic user agent:
```python
browser = await p.chromium.launch(headless=True)
context = await browser.new_context(user_agent="Mozilla/5.0")
```

### Timeout Settings
- Page load timeout: 60 seconds
- Element wait timeout: 10 seconds

## 📈 Performance

- **Asynchronous processing** enables efficient concurrent requests
- **Selective data extraction** focuses only on required elements
- **Memory efficient** processing of large datasets
- Capable of scraping 200+ pages with thousands of drama entries

## 🤝 Contributing

Contributions are welcome! Here are some ways to contribute:

1. **Bug Reports**: Submit issues for any bugs encountered
2. **Feature Requests**: Suggest new data fields or functionality
3. **Code Improvements**: Optimize performance or add new features
4. **Documentation**: Improve or expand documentation

## 📝 License

This project is for educational and research purposes. Please ensure compliance with MyDramaList's terms of service and robots.txt when using this scraper.

## 🆘 Troubleshooting

### Common Issues

1. **Playwright Installation Issues**:
   ```bash
   playwright install --force
   ```

2. **Import Errors in Jupyter**:
   - Ensure `nest_asyncio` is installed and applied
   - Restart kernel if needed

3. **Network Timeouts**:
   - Check internet connection
   - Increase timeout values if needed
   - Add delays between requests

4. **Data Quality Issues**:
   - Verify CSS selectors haven't changed
   - Check MyDramaList site structure updates

---

**Disclaimer**: This tool is intended for educational and research purposes. Users are responsible for ensuring their usage complies with applicable terms of service and legal requirements.
