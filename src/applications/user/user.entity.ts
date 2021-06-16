import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import Post from "../post/post.entity";


@Entity()
export default class User {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({nullable: false})
  public userName: string;

  @Column({nullable: true})
  public name: string;

  @Column({nullable: true})
  public secondName: string;

  @Column({nullable: false})
  public password: string;

  @OneToMany(() => Post, (post: Post) => post.author)
  public posts: Post[];
}
