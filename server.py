import SimpleHTTPServer
import SocketServer
# minimal web server.  serves files relative to the
# current directory.
PORT = 7000
Handler = SimpleHTTPServer.SimpleHTTPRequestHandler
httpd = SocketServer.TCPServer(("", PORT), Handler)
print "Starting ViShruti Server at port", PORT
httpd.serve_forever()