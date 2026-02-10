<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Http\Controllers\AESCipher;

class CoAuthor extends Model
{
    use SoftDeletes;

    protected $table = 'co_authors';

    protected $fillable = [
        'id',
        'fileID',
        'officialID',
        'categoryID'
    ];

    public function official()
    {
        return $this->hasOne(Officials::class, 'id', 'officialID')->withTrashed();
    }

    public function getEncryptedIdAttribute(): string
    {
        return app(AESCipher::class)->encrypt((string) $this->attributes['id']);
    }
}
