using System;
namespace travelFactory
{
	public class AppModel
	{
		public string Title { get; set; }
		public DateTime Deployed { get; set; }
		public List<WordItem> Words { get; set; }

		public AppModel(String appName, List<WordItem>? words = null)
		{
			this.Title = appName;
			this.Deployed = DateTime.Now;
			this.Words = words != null ? new List<WordItem>(words) : new List<WordItem>();
		}
	
		public void AddWord(WordItem word) => Words?.Add(word);
	}

	public class WordItem
	{
		public string Key { get; set; }
		public string English { get; set; }
		public string French { get; set; }
		public string Dutch { get; set; }

		public WordItem(string key, string en, string fr, string du)
		{
			this.Key = key;
			this.English = en;
			this.French = fr;
			this.Dutch = du;
		}

	}
}

