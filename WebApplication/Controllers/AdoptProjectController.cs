﻿using System.Web;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Shared;
using WebApplication.Definitions;
using WebApplication.Services;

namespace WebApplication.Controllers
{
    [ApiController] //TODO: to be changed, this shall not be ApiController
    [Route("adoptProject")]
    public class AdoptProjectController : ControllerBase
    {
        private readonly ILogger<AdoptProjectController> _logger;
        private readonly AdoptProjectService _adoptProjectService;

        public AdoptProjectController(ILogger<AdoptProjectController> logger, AdoptProjectService adoptProjectService)
        {
            this._logger = logger;
            this._adoptProjectService = adoptProjectService;
        }

        [HttpGet]
        public StatusCodeResult AdoptProjectWithParameters(string payloadURL)
        {
            AdoptProjectWithParametersPayload payload = FetchPayload(HttpUtility.UrlDecode(payloadURL));
            _adoptProjectService.AdoptProjectWithParameters(payload);
            return NoContent();
        }

        private AdoptProjectWithParametersPayload FetchPayload(string payloadUrl)
        {
            _logger.LogInformation($"fetching payload from {payloadUrl}");
            return new AdoptProjectWithParametersPayload()
            {
                Name = "Foo",
                Url = "http://url.com/path_to_the_zip",
                TopLevelAssembly = "top_level_assembly.iam",
                Parameters = new InventorParameters()
                {
                    {
                        "Some Param", new InventorParameter()
                        {
                            Label = "Some Label"
                        }
                    }
                }
            };
        }
    }
}
