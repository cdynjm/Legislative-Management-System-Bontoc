<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Http\Controllers\AESCipher;

class Categories extends Model
{
    use SoftDeletes;

    public $relation = ['totalFiles'];

    protected $table = 'categories';

    protected $fillable = [
        'id',
        'category',
        'parentID',
    ];

    public function totalFiles()
    {
        return $this->hasMany(Files::class, 'categoryID', 'id');
    }

    public function getEncryptedIdAttribute(): string
    {
        return app(AESCipher::class)->encrypt((string) $this->attributes['id']);
    }
}
