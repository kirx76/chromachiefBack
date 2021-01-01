import {Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import Category from '../category/category.entity';
import User from '../user/user.entity';

@Entity()
class Post {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({nullable: false})
  public title: string;

  @Column({nullable: false})
  public content: string;

  @Column({type: 'timestamptz', nullable: false, default: () => 'CURRENT_TIMESTAMP'})
  public publicationDate: Date;

  @Column({length: 50, nullable: false, default: ''})
  public description: string;

  @ManyToOne(() => User, (author: User) => author.posts)
  public author: User;

  @ManyToMany(() => Category, (category: Category) => category.posts)
  @JoinTable()
  public categories: Category[];
}

export default Post;
