using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using travelFactory;
using System.Text;


[ApiController]
[Route("[controller]")]
public class AppModelController : ControllerBase
{
    private static List<AppModel> DATA_APPS = dummmyData();
    private static List<AppModel> dummmyData()
    {
        // Example data for WordItem
        string key = "Key1";
        string englishWord = "English1";
        string frenchWord = "French1";
        string dutchWord = "Dutch1";

        // Create a list of AppModel
        List<AppModel> appModels = new List<AppModel>();

        // Populate the list with instances of AppModel
        for (int i = 0; i < 4; i++)
        {
            string Title = $"app{i + 1}";
            AppModel newApp = new AppModel(Title);
            WordItem w = new WordItem(key, englishWord, frenchWord, dutchWord);
            newApp.AddWord(w);
            appModels.Add(newApp);
        }

        return appModels;
    }

    [HttpGet("getSingleApp")]
    public IActionResult GetSingleApp(string appName)
    {
        if (string.IsNullOrEmpty(appName))
        {
            return BadRequest("AppName cannot be empty or null.");
        }

        AppModel foundApp = DATA_APPS.First(app => app.Title.Equals(appName, StringComparison.OrdinalIgnoreCase));

        if (foundApp != null)
        {
            return Ok(foundApp);
        }
        else
        {
            return NotFound($"App with name '{appName}' not found.");
        }
    }

    [HttpPost("CreateApp")]
    public IActionResult CreateApp([FromBody] JsonElement requestBody)
    {
        var title = requestBody.GetProperty("Title").GetString();
        var wordsElement = requestBody.GetProperty("Words");

        if (string.IsNullOrEmpty(title) || wordsElement.ValueKind != JsonValueKind.Array)
        {
            return BadRequest("Invalid request data.");
        }

        // Check if an app with the same title already exists
        if (DATA_APPS.Any(app => app.Title.Equals(title, StringComparison.OrdinalIgnoreCase)))
        {
            return Conflict($"App with name '{title}' already exists.");
        }

        var newApp = new AppModel(title);
        newApp.Words.AddRange(
            wordsElement.EnumerateArray().Select(wordElement => new WordItem(
                wordElement.GetProperty("Key").GetString(),
                wordElement.GetProperty("English").GetString(),
                wordElement.GetProperty("French").GetString(),
                wordElement.GetProperty("Dutch").GetString()
            ))
        );

        DATA_APPS.Add(newApp);

        // Return the newly created app
        return Ok($"App '{newApp.Title}' created successfully.");
    }

    [HttpGet("download")]
    public IActionResult DownloadCsv(string appName)
    {
        // Check if the specified app exists
        AppModel app = DATA_APPS.FirstOrDefault(a => a.Title.Equals(appName, StringComparison.OrdinalIgnoreCase));

        if (app == null)
        {
            return NotFound($"App with name '{appName}' not found.");
        }

        // If the app exists, proceed with CSV generation logic
        // You can replace the following lines with your actual CSV generation logic
        var csvContent = GenerateCsvContent(app);

        // Return the CSV file as a downloadable file
        return File(System.Text.Encoding.UTF8.GetBytes(csvContent), "text/csv", $"{appName}_word_data.csv");
    }

    private string GenerateCsvContent(AppModel app)
    {
        // Example CSV generation logic
        StringBuilder csvContent = new StringBuilder();
        csvContent.AppendLine("Key,English,French,Dutch");

        foreach (WordItem word in app.Words)
        {
            csvContent.AppendLine($"{word.Key},{word.English},{word.French},{word.Dutch}");
        }

        return csvContent.ToString();
    }

    [HttpGet]
    public IEnumerable<AppModel> Get()
    {
        return DATA_APPS.ToArray();
    }
}
