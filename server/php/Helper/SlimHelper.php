<?php
namespace Helper;

class SlimHelper {
    protected $app;

    public function __construct($app)
    {
        $this->app = $app;
    }

    public function returnOr404($data)
    {
        if (empty($data)) {
            $this->app->response()->status(404);
        } else {
            $this->app->response()->write($data);
        }
    }

    public function checkUserId($id)
    {
        if (!isset($_SESSION) || $id != $_SESSION['user_id']) {
            $this->app->response()->status(403);
            $this->app->response()->write("Wrong user_id");
            return false;
        }
        return true;
    }
}
