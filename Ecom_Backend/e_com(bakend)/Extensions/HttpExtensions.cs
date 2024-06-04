using Azure;
using ecom.Entities;
using ecom.RequestHelpers;
using System.Text.Json;

namespace ecom.Extensions
{
    public static class HttpExtensions
    {
         public static void AddPaginationHeader(this HttpResponse response, MetaData metaData)
        {
            var options = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };

            response.Headers.Add("Pagination", JsonSerializer.Serialize(metaData));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}
