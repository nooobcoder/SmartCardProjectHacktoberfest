using System;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using REST.Entities.DatabaseEntities;
using REST.Repositories.Interfaces;

namespace REST.Controllers
{
    [ApiController]
    [Route("auth")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IDatabaseRepository _repository;

        // Constructor
        public AuthenticationController(IDatabaseRepository repository)
        {
            _repository = repository;
        }

        [HttpPost]
        [Route("CreateUser")]
        public async Task<ActionResult<EUser>> CreateUser([FromBody] EUser user)
        {
            try
            {
                EUser _user = await _repository.CreateUser(user);
                return Ok(_user);
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpPost]
        [Route("LoginUser")]
        public async Task<ActionResult<EUser>> LoginUser([FromBody] EUser user)
        {
            try
            {
                EUser _user = await _repository.LoginUser(user);
                // UrlEncode the user object for cookie
                string encodedUser = WebUtility.UrlEncode(JsonConvert.SerializeObject(_user));
                // Secure the cookie
                Response.Cookies.Append(
                    "user",
                    encodedUser,
                    new CookieOptions { HttpOnly = true, Secure = true }
                );
                return Ok(_user);
            }
            catch (Exception e)
            {
                return StatusCode(401, e.Message);
            }
        }

        [HttpDelete]
        [Route("DeleteUser")]
        public async Task<ActionResult<bool>> DeleteUser([FromBody] EUser user)
        {
            try
            {
                if (await _repository.DeleteUser(user))
                    return Ok();
                else
                    return StatusCode(409, "User not found");
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }

        [HttpPut]
        [Route("UpdateUserPin")]
        public async Task<ActionResult<EUser>> UpdateUserPin([FromBody] EUser user)
        {
            try
            {
                EUser _user = await _repository.UpdateUserPin(user);
                return Ok(_user);
            }
            catch (Exception e)
            {
                return StatusCode(500, e.Message);
            }
        }
    }
}
