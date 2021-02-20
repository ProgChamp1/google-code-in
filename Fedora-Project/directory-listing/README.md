# Directory Listing Prevention

### Description

The web server is configured to display the list of files contained in this directory. This is not recommended because the directory may contain files that are not normally exposed through links on the web site.

### Prevention

- Disable Indexing on your server
- If enabling indexing is required, make sure the directory does not contain sensitive information
- Use a CMS
- Sanitize file paths while serving/uploading files
- prevent access of all paths beneath the web root (ex: accessing domain.com/../file.txt)
- atleast have a blank index.{html,php} in every directory if none of the above option is possible

## Sources

https://www.netsparker.com/blog/web-security/disable-directory-listing-web-servers/


https://www.hacksplaining.com/prevention/directory-traversal
