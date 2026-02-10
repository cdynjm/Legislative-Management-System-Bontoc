<?php declare(strict_types=1);

namespace App\GraphQL\Queries\User;

use App\Models\Officials;
use App\Models\User;
use App\Models\Categories;
use App\Models\Files;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Access\AuthorizationException;
use App\Http\Controllers\AESCipher;

final readonly class File
{
    /** @param  array{}  $args */
    public function __invoke(null $_, array $args)
    {
        if (! $this->authorize()) {
            throw new AuthorizationException('You are not authorized to access fields');
        }

        $aes = new AESCipher();
      
        $page = $args['page'];
        $perPage = $args['first'];

        $paginator = Files::with((new Files)->relation)
            ->where('categoryID', $aes->decrypt($args['id']))
            ->where('title', 'like', '%'.$args['search'].'%')
            ->orderBy('created_at', 'DESC')
            ->paginate($perPage, ['*'], 'page', $page);

        return [
            'categoryName' => Categories::find($aes->decrypt($args['id'])),
            
            'filesListPaginated' => [
                'data' => $paginator->items(),
                'paginatorInfo' => [
                    'currentPage' => $paginator->currentPage(),
                    'lastPage' => $paginator->lastPage(),
                    'perPage' => $paginator->perPage(),
                    'total' => $paginator->total(),
                    'hasMorePages' => $paginator->hasMorePages(),
                ],
            ],

            'authors' => Officials::orderBy('name', 'ASC')->get(),

            'subCategoriesList' => Categories::where('parentID', $aes->decrypt($args['id']))
            ->where('category', 'like', '%'.$args['search'].'%')
            ->orderBy('created_at', 'DESC')->get(),
        ];
    }
    private function authorize(): bool
    {
        return Auth::user()->can('accessUser');
    }
}
