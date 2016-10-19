'use strict'

// Error code messages.
module.exports = {
  'test_msg': 'Test message.',
  'client_error_no_bus_connected': '[<%=uuid%>][<%=type%>][<%=name%>] no bus connected to initialize the client',
  'server_error_no_bus_connected': '[<%=uuid%>][<%=type%>][<%=name%>] no bus connected to initialize the server',
  'server_error_no_file': '[<%=uuid%>][<%=type%>][<%=name%>] no file found to initialize the server',
  'service_error': '[<%=uuid%>][<%=type%>][<%=name%>] an error occured in service execution',
  'server_rabbot_error': '[<%=uuid%>][<%=type%>][<%=name%>] an error occured in server rabbot.configure',
  'client_rabbot_error': '[<%=uuid%>][<%=type%>][<%=name%>] an error occured in client rabbot.configure'
}
