###############################################################
Description of global architecture
###############################################################



#####################
Collections
#####################

Authors : contains the list of all authors. An author is a user (student) without an account. Only teachers have an account (and can be "connected").
Blogs : contains the list of all blogs.
Categories : contains the list of all categories. Only teachers can edit categories.
Codes : contains the list of all blog codes. Used to check if a code is already assigned.
Images : contains the reference (id) of all images uploaded.
Posts : contains the list of all posts.
Tags : contains the list of all tags.



#####################
Layout
#####################

Global layout template used for all templates. Contains 4 yield regions filled by router: menu (slideout lateral menu), header, main, footer.



#####################
BlogList
#####################

The HomePage of beekee. Allows user to access a blog with an access code. If user is connected, displays his blog list. Also displays a list of visited blogs.



#####################
BlogPage
#####################

Displays blog posts (PostItem template) and contains all the subscription/filtering logic.



#####################
Filtering and displaying posts logic
#####################

Posts subscription is updated reactively. By default, only the first 10 posts of the blog are loaded. The server send a list of posts sorted by submission date (latest at the end). It send an interval of 10 posts by skipping all posts - 10. If user want to load 10 more posts, the skip value is reduced by 10, etc.
Posts can be loaded reactively (in real time) if the option is enabled in settings. If not, the server publication is limited with the "limit" value (set by default to 10, and +10 if user load 10 more posts). When a post is sended by someone else, the counter "count-all-posts" (see publications) is updated and client is aware of this without to having to subscribe to all posts to count them (preserve brandwidth and load). If reactive "count-all-posts" is greater than "count-all-posts" set when the page is loaded, it displays an alert (you have X new messages) to the user.
User can filter posts by author, category or tag. Each filtering involve a recalculation of skip and limit parameters. The count of posts is not done with "count-all-posts" but refers to the field nRefs of each filter.  



#####################
Desktop Menu & Mobile Menu
#####################

Menus that display authors, categories and tags, and allow filtering posts. Desktop menu is included in main yield and is displayed only on desktops. Mobile menu is a slideout menu that is included in menu yield.



#####################
Uploading images
#####################

Image upload is based on tomitrescak:meteor-uploads. uploadForm is the client-side, with autostart input. upload.js is server-side and use GraphicMagicks to resize and auto-orient images. When image is uploaded and resized, its id is inserted in Images collection. Client check if image is in Images collection to know if server-side process is finished.



#####################
Admin
#####################

Restricted access. Displays all blogs and all users.

